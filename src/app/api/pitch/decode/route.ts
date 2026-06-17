import { NextResponse } from "next/server";
import { getAiConfig, getVisionModel } from "@/lib/ai/aiConfig";
import {
  chatComplete,
  parseJsonResponse,
  type ChatMessage,
} from "@/lib/ai/opencodeClient";
import {
  DECODE_SYSTEM_PROMPT,
  buildDecodeUserPrompt,
} from "@/lib/ai/prompts";
import type { DecodedBrief } from "@/data/pitchStatic";

type DecodeRequest = {
  /** Plain-text/markdown transcript of the brief (preferred path) */
  transcript?: string;
  /** Data-URL page images for image-only PDFs (vision path) */
  images?: string[];
  fileName?: string;
};

export async function POST(req: Request) {
  const config = getAiConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Real AI is not configured on the server." },
      { status: 503 }
    );
  }

  let body: DecodeRequest;
  try {
    body = (await req.json()) as DecodeRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const hasTranscript = Boolean(body.transcript && body.transcript.trim());
  const hasImages = Boolean(body.images && body.images.length > 0);

  if (!hasTranscript && !hasImages) {
    return NextResponse.json(
      { error: "Provide a brief transcript or page images to decode." },
      { status: 400 }
    );
  }

  const messages: ChatMessage[] = [
    { role: "system", content: DECODE_SYSTEM_PROMPT },
  ];

  if (hasTranscript) {
    messages.push({
      role: "user",
      content: buildDecodeUserPrompt(body.transcript!, body.fileName),
    });
  } else {
    messages.push({
      role: "user",
      content: [
        {
          type: "text",
          text: buildDecodeUserPrompt(
            "(brief provided as page images below)",
            body.fileName
          ),
        },
        ...body.images!.map((url) => ({
          type: "image_url" as const,
          image_url: { url },
        })),
      ],
    });
  }

  try {
    const raw = await chatComplete(messages, {
      json: true,
      model: hasTranscript ? config.model : getVisionModel(config),
      temperature: 0.6,
    });
    const decoded = parseJsonResponse<DecodedBrief>(raw);
    return NextResponse.json({ decoded });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "AI decode failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
