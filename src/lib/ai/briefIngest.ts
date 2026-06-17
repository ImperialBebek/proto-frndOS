/** Client-side brief ingest — extract text from PDFs for Live AI decode. */

export type BriefIngestResult =
  | { kind: "transcript"; transcript: string; pageCount: number }
  | {
      kind: "images";
      images: string[];
      pageCount: number;
      note: string;
    };

const MIN_TEXT_CHARS = 120;
const MAX_VISION_PAGES = 5;

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

async function loadPdfJs() {
  const pdfjs = await import("pdfjs-dist");
  if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
  }
  return pdfjs;
}

/** Extract plain text from every page of a PDF file. */
export async function extractPdfText(file: File): Promise<{
  text: string;
  pageCount: number;
}> {
  const pdfjs = await loadPdfJs();
  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const parts: string[] = [];

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum += 1) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    if (pageText.trim()) {
      parts.push(`--- Page ${pageNum} ---\n${pageText.trim()}`);
    }
  }

  return {
    text: normalizeText(parts.join("\n\n")),
    pageCount: doc.numPages,
  };
}

/** Render PDF pages to JPEG data URLs for the vision decode path. */
export async function renderPdfPageImages(
  file: File,
  maxPages = MAX_VISION_PAGES
): Promise<{ images: string[]; pageCount: number }> {
  const pdfjs = await loadPdfJs();
  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const limit = Math.min(doc.numPages, maxPages);
  const images: string[] = [];

  for (let pageNum = 1; pageNum <= limit; pageNum += 1) {
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) continue;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;
    images.push(canvas.toDataURL("image/jpeg", 0.82));
  }

  return { images, pageCount: doc.numPages };
}

/** Pick transcript or vision images from an uploaded PDF. */
export async function ingestPdfBrief(
  file: File,
  options: { allowVision: boolean }
): Promise<BriefIngestResult> {
  const { text, pageCount } = await extractPdfText(file);

  if (text.length >= MIN_TEXT_CHARS) {
    return { kind: "transcript", transcript: text, pageCount };
  }

  if (!options.allowVision) {
    throw new Error(
      "This PDF looks image-only and no vision model is configured. Set OPENCODE_VISION_MODEL in .env.local, or paste the brief text below."
    );
  }

  const { images } = await renderPdfPageImages(file);
  if (images.length === 0) {
    throw new Error(
      "Could not read this PDF. Try a text-based PDF or paste the brief text below."
    );
  }

  return {
    kind: "images",
    images,
    pageCount,
    note:
      pageCount > MAX_VISION_PAGES
        ? `Sent first ${MAX_VISION_PAGES} of ${pageCount} pages to the vision model.`
        : `Sent ${pageCount} page${pageCount === 1 ? "" : "s"} to the vision model.`,
  };
}
