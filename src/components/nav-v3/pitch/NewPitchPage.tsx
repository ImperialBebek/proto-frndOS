/** PROTOTYPE New pitch page — upload/sample → AI decode (mock or live) →
 *  editable suggestion form with scope options + per-track reasoning. */

"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowLeft,
  Check,
  CircleNotch,
  Cpu,
  FileArrowUp,
  GitBranch,
  Info,
  Lightning,
  Plus,
  Sparkle,
  Trash,
} from "@phosphor-icons/react";
import { usePitch } from "@/context/PitchProvider";
import { useAiMode } from "@/context/AiModeProvider";
import { decodeBrief } from "@/lib/ai/pitchAiClient";
import { ingestPdfBrief } from "@/lib/ai/briefIngest";
import {
  buildScopeOptions,
  deliverableToTrackInput,
  describeTrackType,
  getCaseDecode,
  PITCH_CASES,
  PITCH_TRACK_TYPE_LABEL,
  type DecodedBrief,
  type NewPitchTrackInput,
  type PitchScopeOption,
  type PitchTrackType,
} from "@/data/pitchStatic";
import { prefersReducedMotion } from "@/lib/v3ShellMotion";
import { TRACK_TYPE_COLOR, TRACK_TYPE_ICON } from "./PitchStepCanvases";
import { AiModeToggle } from "./AiModeToggle";
import { EvidenceStrengthBadge } from "./TrackEvidenceShared";
import { TrackEvidenceInlinePanel } from "./TrackEvidenceInline";
import { TrackEvidenceTraceModal } from "./TrackEvidenceTraceModal";
import {
  ReasoningVariantTabs,
  type ReasoningVariant,
} from "./ReasoningVariantTabs";
import {
  TrackReasoningDrawer,
  type ReasoningTrack,
} from "./TrackReasoningDrawer";

type Phase = "upload" | "decoding" | "form";

type DecodeLine = { id: string; text: string; delay: number };

const DECODE_LINES: DecodeLine[] = [
  { id: "read", text: "Reading the brief…", delay: 500 },
  { id: "brand", text: "Detecting brand & project…", delay: 900 },
  { id: "cases", text: "Scanning deliverables & study cases…", delay: 1000 },
  { id: "plan", text: "Drafting your pitch setup…", delay: 1100 },
];

const FORM_REVEAL_AFTER_MS =
  DECODE_LINES.reduce((acc, line) => acc + line.delay, 0) + 700;

type EditableTrack = NewPitchTrackInput & { key: string };

let trackKeySeq = 0;
const nextTrackKey = () => `nt-${++trackKeySeq}`;

const SAMPLE_CASE_IDS = ["ikea", "goodrich", "sunsilk"] as const;

type NewPitchPageProps = {
  onOpenPitch: (pitchId: string) => void;
  onBackToPitchList: () => void;
};

export function NewPitchPage({
  onOpenPitch,
  onBackToPitchList,
}: NewPitchPageProps) {
  const { createPitch } = usePitch();
  const { isReal, hasVision } = useAiMode();

  const [phase, setPhase] = useState<Phase>("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [caseId, setCaseId] = useState<string>("ikea");
  const [dragOver, setDragOver] = useState(false);
  const [decodedCount, setDecodedCount] = useState(0);
  const [realError, setRealError] = useState<string | null>(null);
  const [ingestNote, setIngestNote] = useState<string | null>(null);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Suggestion form state */
  const [brand, setBrand] = useState("");
  const [project, setProject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [pitchType, setPitchType] = useState("Competition Pitch");
  const [briefEssence, setBriefEssence] = useState("");
  const [projectType, setProjectType] = useState("");
  const [scopeOptions, setScopeOptions] = useState<PitchScopeOption[]>([]);
  const [activeScopeId, setActiveScopeId] = useState<string>("balanced");
  const [tracks, setTracks] = useState<EditableTrack[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [drawerTrack, setDrawerTrack] = useState<ReasoningTrack | null>(null);
  const [reasoningVariant, setReasoningVariant] =
    useState<ReasoningVariant>("drawer");
  const [traceModalOpen, setTraceModalOpen] = useState(false);
  const [expandedInlineKeys, setExpandedInlineKeys] = useState<Set<string>>(
    () => new Set()
  );

  const phaseRef = useRef<HTMLDivElement>(null);

  /** Populate the form from a uniform decode result */
  const applyDecode = (result: {
    caseId: string;
    briefEssence: string;
    projectType: string;
    all: NewPitchTrackInput[];
    ambitious: NewPitchTrackInput[];
    form: { brand: string; project: string; deadline: string; pitchType: string };
  }) => {
    setCaseId(result.caseId);
    setBriefEssence(result.briefEssence);
    setProjectType(result.projectType);
    setBrand(result.form.brand);
    setProject(result.form.project);
    setDeadline(result.form.deadline);
    setPitchType(result.form.pitchType);
    const options = buildScopeOptions(result.all, result.ambitious);
    setScopeOptions(options);
    const balanced = options.find((o) => o.id === "balanced") ?? options[0];
    setActiveScopeId(balanced.id);
    setTracks(balanced.tracks.map((t) => ({ ...t, key: nextTrackKey() })));
    setPhase("form");
  };

  const mockDecodeForCase = (id: string) => {
    const decode = getCaseDecode(id);
    const meta = PITCH_CASES[id];
    applyDecode({
      caseId: id,
      briefEssence: decode.briefEssence,
      projectType: decode.projectType,
      all: decode.pitchPlan.deliverables.map(deliverableToTrackInput),
      ambitious: decode.ambitiousExtraTracks ?? [],
      form: meta?.form ?? {
        brand: "",
        project: "New Campaign Pitch",
        deadline: "",
        pitchType: "Competition Pitch",
      },
    });
  };

  const formFromDecode = (
    id: string,
    decoded: DecodedBrief
  ): {
    brand: string;
    project: string;
    deadline: string;
    pitchType: string;
  } => {
    const meta = PITCH_CASES[id]?.form;
    if (meta) return meta;
    const brandGuess =
      decoded.projectType?.split(/[·\-–—|]/)[0]?.trim() ||
      decoded.briefEssence.split(/[.,]/)[0]?.slice(0, 48).trim() ||
      "Client Brand";
    return {
      brand: brandGuess,
      project: decoded.projectType || "New Campaign Pitch",
      deadline: "",
      pitchType: "Competition Pitch",
    };
  };

  const realDecodeFromTracks = (
    id: string,
    decoded: DecodedBrief,
    form: { brand: string; project: string; deadline: string; pitchType: string }
  ) => {
    applyDecode({
      caseId: id,
      briefEssence: decoded.briefEssence,
      projectType: decoded.projectType,
      all: decoded.deliverables.map((d) => ({
        title: d.title,
        type: d.type,
        summary: d.summary,
        planLabel: d.planLabel,
        reasoning: d.reasoning,
        sourceExcerpt: d.sourceExcerpt,
        sourcePage: d.sourcePage,
        evidenceStrength: d.evidenceStrength,
        evidenceSignals: d.evidenceSignals,
      })),
      ambitious: getCaseDecode(id).ambitiousExtraTracks ?? [],
      form,
    });
  };

  const runRealDecodeInput = async (
    id: string,
    input: { transcript?: string; images?: string[] },
    name: string,
    note?: string
  ) => {
    setFileName(name);
    setDecodedCount(0);
    setCaseId(id);
    setPhase("decoding");
    setRealError(null);
    if (note) setIngestNote(note);
    try {
      const decoded = await decodeBrief({ ...input, fileName: name });
      realDecodeFromTracks(id, decoded, formFromDecode(id, decoded));
    } catch (err) {
      setRealError(
        (err instanceof Error ? err.message : "Live decode failed") +
          " — showing mock data instead."
      );
      mockDecodeForCase(id === "upload" ? "ikea" : id);
    } finally {
      setIngestNote(null);
    }
  };

  const runRealDecode = async (
    id: string,
    transcript: string,
    name: string
  ) => {
    await runRealDecodeInput(id, { transcript }, name);
  };

  const handlePdfUpload = async (file: File) => {
    setRealError(null);
    setCaseId("upload");
    setFileName(file.name);
    setDecodedCount(0);
    setPhase("decoding");
    setIngestNote("Reading PDF…");
    try {
      const result = await ingestPdfBrief(file, { allowVision: hasVision });
      if (result.kind === "transcript") {
        await runRealDecodeInput(
          "upload",
          { transcript: result.transcript },
          file.name,
          `Extracted text from ${result.pageCount} page${
            result.pageCount === 1 ? "" : "s"
          }. Sending to AI…`
        );
        return;
      }
      await runRealDecodeInput(
        "upload",
        { images: result.images },
        file.name,
        result.note
      );
    } catch (err) {
      setPhase("upload");
      setIngestNote(null);
      setRealError(
        err instanceof Error
          ? err.message
          : "Could not read this PDF. Paste the brief text below."
      );
      setPasteOpen(true);
    }
  };

  const startSample = (id: string) => {
    setCaseId(id);
    setRealError(null);
    setFileName(PITCH_CASES[id]?.decode.briefFileName ?? "sample brief");
    setDecodedCount(0);
    setPhase("decoding");
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    setRealError(null);
    const isText =
      file.type.startsWith("text/") || /\.(txt|md)$/i.test(file.name);
    const isPdf =
      file.type === "application/pdf" || /\.pdf$/i.test(file.name);

    if (isReal && isText) {
      file.text().then((text) => {
        setPasteText(text);
        void runRealDecode("upload", text, file.name);
      });
      return;
    }
    if (isReal && isPdf) {
      void handlePdfUpload(file);
      return;
    }
    if (isReal) {
      setRealError(
        "Live AI supports PDF, TXT, and MD uploads. Paste the brief text below for DOC/DOCX."
      );
      setPasteOpen(true);
      return;
    }
    // Mock mode: arbitrary uploads preview with the IKEA sample dataset.
    setCaseId("ikea");
    setDecodedCount(0);
    setPhase("decoding");
  };

  /* Decoding stage: mock = staged lines; real sample = live API call */
  useEffect(() => {
    if (phase !== "decoding") return;

    if (isReal) {
      if (caseId !== "upload" && PITCH_CASES[caseId]) {
        let active = true;
        decodeBrief({
          transcript: PITCH_CASES[caseId].transcript,
          fileName: PITCH_CASES[caseId].decode.briefFileName,
        })
          .then((decoded) => {
            if (!active) return;
            realDecodeFromTracks(
              caseId,
              decoded,
              formFromDecode(caseId, decoded)
            );
          })
          .catch((err) => {
            if (!active) return;
            setRealError(
              (err instanceof Error ? err.message : "Live decode failed") +
                " — showing mock data instead."
            );
            mockDecodeForCase(caseId);
          });
        return () => {
          active = false;
        };
      }
      // Custom uploads are decoded by handlePdfUpload / runRealDecodeInput.
      return;
    }

    // Mock staged animation
    const timers: number[] = [];
    let elapsed = 0;
    DECODE_LINES.forEach((line, index) => {
      elapsed += line.delay;
      timers.push(
        window.setTimeout(() => setDecodedCount(index + 1), elapsed)
      );
    });
    timers.push(
      window.setTimeout(() => mockDecodeForCase(caseId), FORM_REVEAL_AFTER_MS)
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, isReal, caseId]);

  useGSAP(
    () => {
      const node = phaseRef.current;
      if (!node) return;
      if (prefersReducedMotion()) {
        gsap.set(node, { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        node,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    },
    { dependencies: [phase] }
  );

  const applyScope = (option: PitchScopeOption) => {
    setActiveScopeId(option.id);
    setTracks(option.tracks.map((t) => ({ ...t, key: nextTrackKey() })));
  };

  const updateTrack = (key: string, patch: Partial<NewPitchTrackInput>) => {
    setTracks((prev) =>
      prev.map((t) => (t.key === key ? { ...t, ...patch } : t))
    );
    setActiveScopeId("custom");
  };

  const removeTrack = (key: string) => {
    setTracks((prev) => prev.filter((t) => t.key !== key));
    setActiveScopeId("custom");
  };

  const addTrack = () => {
    setTracks((prev) => [
      ...prev,
      { key: nextTrackKey(), title: "New deliverable track", type: "campaign" },
    ]);
    setActiveScopeId("custom");
  };

  const handleCreate = () => {
    if (!brand.trim()) {
      setError("Brand name is required.");
      return;
    }
    if (tracks.length === 0) {
      setError("Keep at least one deliverable track.");
      return;
    }
    if (tracks.some((t) => !t.title.trim())) {
      setError("Every track needs a name.");
      return;
    }
    const id = createPitch({
      brand,
      project,
      deadline,
      pitchType,
      caseId,
      tracks: tracks.map(
        ({
          title,
          type,
          summary,
          planLabel,
          reasoning,
          sourceExcerpt,
          sourcePage,
          evidenceStrength,
          evidenceSignals,
        }) => ({
          title: title.trim(),
          type,
          summary,
          planLabel,
          reasoning,
          sourceExcerpt,
          sourcePage,
          evidenceStrength,
          evidenceSignals,
        })
      ),
    });
    onOpenPitch(id);
  };

  const trackCounts = (["brand", "campaign", "content"] as PitchTrackType[])
    .map((type) => ({
      type,
      count: tracks.filter((t) => t.type === type).length,
    }))
    .filter((entry) => entry.count > 0);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-8 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToPitchList}
            className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium text-text-inverse-subtle transition hover:text-text-inverse"
          >
            <ArrowLeft size={14} />
            Back to Pitches
          </button>
          <AiModeToggle />
        </div>

        <div className="mt-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtle">
            frndOS Pitch · New
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.4px] text-text-inverse">
            {phase === "form" ? "Review the pitch setup" : "Start a new pitch"}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-inverse-subtle">
            {phase === "form"
              ? "frndOS decoded the brief into a suggested setup. The AI only detects how many tracks and what type — adjust anything before creating the pitch."
              : "Drop the client brief and frndOS will work out the brand, the study cases inside it, and the deliverable tracks you need to make."}
          </p>
        </div>

        <div ref={phaseRef} className="mt-8">
          {phase === "upload" && (
            <div className="flex flex-col gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.md"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragOver(false);
                  const file = event.dataTransfer.files?.[0];
                  if (file) handleFile(file);
                }}
                className={`flex w-full flex-col items-center gap-3 rounded-md border border-dashed px-8 py-16 transition ${
                  dragOver
                    ? "border-sky-400/70 bg-sky-500/[0.08]"
                    : "border-line bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.03]"
                }`}
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-white/[0.05]">
                  <FileArrowUp size={26} className="text-text-inverse-subtle" />
                </span>
                <div>
                  <p className="text-base font-medium text-text-inverse">
                    Drop the client brief here
                  </p>
                  <p className="mt-1 text-xs text-text-inverse-subtlest">
                    PDF, DOCX, TXT or MD — or click to browse
                  </p>
                </div>
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11px] font-medium text-text-inverse-subtle">
                  {isReal ? (
                    <Lightning size={13} className="text-sky-300" weight="fill" />
                  ) : (
                    <Cpu size={13} className="text-sky-300" />
                  )}
                  {isReal
                    ? "Live AI will decode the brief"
                    : "frndOS detects the brand, study cases and pitch tracks for you"}
                </span>
              </button>

              {realError && phase === "upload" && (
                <div className="rounded-md border border-amber-400/30 bg-amber-500/[0.08] px-4 py-3 text-sm text-amber-100">
                  {realError}
                </div>
              )}

              <button
                type="button"
                onClick={() => setPasteOpen((v) => !v)}
                className="self-center text-xs font-medium text-text-inverse-subtle underline-offset-2 transition hover:text-text-inverse hover:underline"
              >
                {pasteOpen ? "Hide paste box" : "Or paste the brief text"}
              </button>
              {pasteOpen && (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    rows={5}
                    placeholder="Paste the brief text here…"
                    className="w-full rounded-sm border border-line bg-white/[0.03] px-3 py-2 text-sm text-text-inverse outline-none placeholder:text-text-inverse-subtlest focus:border-white/30"
                  />
                  <button
                    type="button"
                    disabled={!pasteText.trim()}
                    onClick={() => {
                      if (isReal) {
                        runRealDecode("upload", pasteText, "Pasted brief");
                      } else {
                        setCaseId("ikea");
                        setFileName("Pasted brief");
                        setDecodedCount(0);
                        setPhase("decoding");
                      }
                    }}
                    className="self-start rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition hover:bg-white/90 disabled:opacity-40"
                  >
                    Decode pasted text
                  </button>
                </div>
              )}

              <div className="mt-2">
                <p className="mb-2 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtlest">
                  Or try a sample brief
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {SAMPLE_CASE_IDS.map((id) => {
                    const meta = PITCH_CASES[id];
                    if (!meta) return null;
                    const count = meta.decode.pitchPlan.deliverables.length;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => startSample(id)}
                        className="flex flex-col gap-1 rounded-md border border-line bg-white/[0.02] p-3 text-left transition hover:border-white/20 hover:bg-white/[0.04]"
                      >
                        <span className="text-sm font-medium text-text-inverse">
                          {meta.form.brand}
                        </span>
                        <span className="text-[11px] leading-snug text-text-inverse-subtle">
                          {meta.form.project}
                        </span>
                        <span className="mt-1 text-[10px] font-medium text-sky-300">
                          {count} track{count === 1 ? "" : "s"} detected
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {phase === "decoding" && (
            <div className="rounded-md border border-line bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.10),_transparent_45%)] p-8">
              <div className="flex items-center gap-2.5">
                {isReal ? (
                  <Lightning
                    size={18}
                    weight="fill"
                    className="animate-pulse text-sky-300"
                  />
                ) : (
                  <Cpu size={18} className="animate-pulse text-sky-300" />
                )}
                <p className="text-sm font-medium text-text-inverse">
                  {isReal ? "Decoding with Live AI" : "Decoding"} {fileName}
                </p>
              </div>
              {isReal ? (
                <div className="mt-6 flex items-center gap-2.5">
                  <CircleNotch size={14} className="animate-spin text-sky-300" />
                  <p className="text-sm text-text-inverse-subtle">
                    {ingestNote ?? "Sending the brief to the AI gateway…"}
                  </p>
                </div>
              ) : (
                <div className="mt-6 flex flex-col gap-3">
                  {DECODE_LINES.map((line, index) => {
                    const done = index < decodedCount;
                    const active = index === decodedCount;
                    if (!done && !active) {
                      return (
                        <div
                          key={line.id}
                          className="flex h-5 items-center gap-2.5 opacity-30"
                        >
                          <span className="size-3.5 rounded-full border border-line" />
                          <div className="h-2.5 w-44 rounded bg-white/[0.06]" />
                        </div>
                      );
                    }
                    return (
                      <div key={line.id} className="flex items-center gap-2.5">
                        {done ? (
                          <span className="flex size-3.5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                            <Check size={8} weight="bold" />
                          </span>
                        ) : (
                          <CircleNotch
                            size={14}
                            className="animate-spin text-sky-300"
                          />
                        )}
                        <p
                          className={`text-sm ${
                            done
                              ? "text-text-inverse-subtle"
                              : "text-text-inverse"
                          }`}
                        >
                          {line.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {phase === "form" && (
            <div className="flex flex-col gap-6 pb-24">
              <div className="rounded-md border border-line bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.10),_transparent_45%)] p-5">
                <div className="flex items-center gap-2">
                  <Sparkle size={15} className="text-sky-300" />
                  <p className="text-sm font-medium text-text-inverse">
                    Decoded from {fileName}
                  </p>
                  {isReal && !realError && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-medium text-sky-200">
                      <Lightning size={10} weight="fill" />
                      Live AI
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-text-inverse-subtle">
                  Brief essence: “{briefEssence}” · {projectType}. frndOS
                  detected {tracks.length} deliverable track
                  {tracks.length === 1 ? "" : "s"} — everything below is
                  editable.
                </p>
                {realError && (
                  <p className="mt-2 rounded-sm bg-amber-500/[0.08] px-3 py-2 text-[11px] text-amber-200">
                    {realError}
                  </p>
                )}
                {trackCounts.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {trackCounts.map(({ type, count }) => (
                      <span
                        key={type}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${TRACK_TYPE_COLOR[type]}`}
                      >
                        {TRACK_TYPE_ICON[type]}
                        {count} × {PITCH_TRACK_TYPE_LABEL[type]}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {scopeOptions.length > 1 && (
                <section>
                  <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtlest">
                    Scope options
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {scopeOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => applyScope(option)}
                        className={`flex flex-col gap-1 rounded-md border p-3 text-left transition ${
                          activeScopeId === option.id
                            ? "border-sky-400/50 bg-sky-500/[0.08]"
                            : "border-line bg-white/[0.02] hover:border-white/20"
                        }`}
                      >
                        <span className="flex items-center justify-between text-sm font-medium text-text-inverse">
                          {option.label}
                          {option.id === "balanced" && (
                            <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-medium text-emerald-300">
                              Rec
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] leading-snug text-text-inverse-subtle">
                          {option.description}
                        </span>
                      </button>
                    ))}
                  </div>
                  {activeScopeId === "custom" && (
                    <p className="mt-2 text-[11px] text-text-inverse-subtlest">
                      Custom plan — edited from a scope option.
                    </p>
                  )}
                </section>
              )}

              <section>
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtlest">
                  Pitch details
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Brand" required>
                    <input
                      value={brand}
                      onChange={(event) => {
                        setBrand(event.target.value);
                        setError(null);
                      }}
                      className="h-9 w-full rounded-sm border border-line bg-white/[0.03] px-3 text-sm text-text-inverse outline-none placeholder:text-text-inverse-subtlest focus:border-white/30"
                    />
                  </Field>
                  <Field label="Project name">
                    <input
                      value={project}
                      onChange={(event) => setProject(event.target.value)}
                      className="h-9 w-full rounded-sm border border-line bg-white/[0.03] px-3 text-sm text-text-inverse outline-none placeholder:text-text-inverse-subtlest focus:border-white/30"
                    />
                  </Field>
                  <Field label="Pitch deadline">
                    <input
                      value={deadline}
                      onChange={(event) => setDeadline(event.target.value)}
                      className="h-9 w-full rounded-sm border border-line bg-white/[0.03] px-3 text-sm text-text-inverse outline-none placeholder:text-text-inverse-subtlest focus:border-white/30"
                    />
                  </Field>
                  <Field label="Pitch type">
                    <select
                      value={pitchType}
                      onChange={(event) => setPitchType(event.target.value)}
                      className="h-9 w-full rounded-sm border border-line bg-white/[0.03] px-2 text-sm text-text-inverse outline-none focus:border-white/30 [&>option]:bg-neutral-900"
                    >
                      <option>Competition Pitch</option>
                      <option>Client Pitch</option>
                      <option>Internal Brief</option>
                    </select>
                  </Field>
                </div>
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtlest">
                    Deliverable tracks ({tracks.length})
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {reasoningVariant === "trace" && tracks.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setTraceModalOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-[11px] font-medium text-sky-200 transition hover:border-sky-400/50"
                      >
                        <GitBranch size={12} />
                        Review AI evidence
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={addTrack}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11px] font-medium text-text-inverse-subtle transition hover:border-white/20 hover:text-text-inverse"
                    >
                      <Plus size={12} weight="bold" />
                      Add track
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {tracks.map((track, index) => {
                    const inlineOpen = expandedInlineKeys.has(track.key);
                    const toggleInline = () => {
                      setExpandedInlineKeys((prev) => {
                        const next = new Set(prev);
                        if (next.has(track.key)) next.delete(track.key);
                        else next.add(track.key);
                        return next;
                      });
                    };

                    return (
                      <div key={track.key} className="flex flex-col gap-0">
                        <div className="flex items-center gap-3 rounded-md border border-line bg-white/[0.02] p-3">
                          <span className="w-8 shrink-0 text-center font-mono text-[10px] text-text-inverse-subtlest">
                            T{String(index + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={`flex size-7 shrink-0 items-center justify-center rounded-full ${TRACK_TYPE_COLOR[track.type]}`}
                          >
                            {TRACK_TYPE_ICON[track.type]}
                          </span>
                          <div className="min-w-0 flex-1">
                            <input
                              value={track.title}
                              onChange={(event) => {
                                updateTrack(track.key, {
                                  title: event.target.value,
                                });
                                setError(null);
                              }}
                              aria-label={`Track ${index + 1} name`}
                              className="h-7 w-full rounded-sm border border-transparent bg-transparent px-2 text-sm text-text-inverse outline-none transition focus:border-white/30 focus:bg-white/[0.03]"
                            />
                            <div className="flex flex-wrap items-center gap-2 px-2">
                              {reasoningVariant === "drawer" && (
                                <button
                                  type="button"
                                  onClick={() => setDrawerTrack(track)}
                                  className="inline-flex items-center gap-1 text-[10px] font-medium text-sky-300/80 transition hover:text-sky-300"
                                >
                                  <Info size={10} />
                                  {track.planLabel ??
                                    describeTrackType(track.type, 1, 1)}{" "}
                                  · why this track?
                                </button>
                              )}
                              {reasoningVariant === "inline" && (
                                <button
                                  type="button"
                                  onClick={toggleInline}
                                  className="inline-flex items-center gap-1 text-[10px] font-medium text-sky-300/80 transition hover:text-sky-300"
                                >
                                  <Info size={10} />
                                  {inlineOpen ? "Hide" : "Show"} evidence
                                </button>
                              )}
                              {reasoningVariant === "trace" && (
                                <EvidenceStrengthBadge track={track} />
                              )}
                              {(reasoningVariant === "drawer" ||
                                reasoningVariant === "inline") && (
                                <EvidenceStrengthBadge track={track} />
                              )}
                            </div>
                          </div>
                          <select
                            value={track.type}
                            onChange={(event) =>
                              updateTrack(track.key, {
                                type: event.target.value as PitchTrackType,
                              })
                            }
                            aria-label={`Track ${index + 1} type`}
                            className="h-8 shrink-0 rounded-sm border border-line bg-white/[0.03] px-2 text-xs text-text-inverse outline-none focus:border-white/30 [&>option]:bg-neutral-900"
                          >
                            {(
                              ["brand", "campaign", "content"] as PitchTrackType[]
                            ).map((type) => (
                              <option key={type} value={type}>
                                {PITCH_TRACK_TYPE_LABEL[type]}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => removeTrack(track.key)}
                            aria-label={`Remove track ${index + 1}`}
                            className="flex size-8 shrink-0 items-center justify-center rounded-sm text-text-inverse-subtlest transition hover:bg-white/[0.06] hover:text-red-300"
                          >
                            <Trash size={14} />
                          </button>
                        </div>

                        {reasoningVariant === "inline" && inlineOpen && (
                          <TrackEvidenceInlinePanel track={track} />
                        )}
                      </div>
                    );
                  })}
                  {tracks.length === 0 && (
                    <p className="rounded-md border border-dashed border-line px-4 py-6 text-center text-xs text-text-inverse-subtlest">
                      No tracks left — add at least one deliverable track.
                    </p>
                  )}
                </div>
              </section>

              {error && <p className="text-xs text-red-300">{error}</p>}

              <div className="flex items-center justify-end gap-3 border-t border-line pt-5">
                <button
                  type="button"
                  onClick={onBackToPitchList}
                  className="rounded-full border border-line px-4 py-2 text-xs font-medium text-text-inverse-subtle transition hover:text-text-inverse"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreate}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
                >
                  <Cpu size={15} />
                  Create pitch
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {phase === "form" && (
        <ReasoningVariantTabs
          value={reasoningVariant}
          onChange={setReasoningVariant}
        />
      )}

      <TrackReasoningDrawer
        track={reasoningVariant === "drawer" ? drawerTrack : null}
        onClose={() => setDrawerTrack(null)}
      />

      {traceModalOpen && (
        <TrackEvidenceTraceModal
          tracks={tracks}
          briefEssence={briefEssence}
          onClose={() => setTraceModalOpen(false)}
        />
      )}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-medium text-text-inverse-subtle">
        {label}
        {required && <span className="ml-0.5 text-red-300">*</span>}
      </span>
      {children}
    </label>
  );
}
