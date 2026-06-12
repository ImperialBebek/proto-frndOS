/** PROTOTYPE New pitch page — upload-first creation: brief → AI decode → editable suggestion form */

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
  Plus,
  Sparkle,
  Trash,
} from "@phosphor-icons/react";
import { usePitch } from "@/context/PitchProvider";
import {
  IKEA_DECODE,
  PITCH_TRACK_TYPE_LABEL,
  SUGGESTED_PITCH_FORM,
  SUGGESTED_TRACKS,
  type NewPitchTrackInput,
  type PitchTrackType,
} from "@/data/pitchStatic";
import { prefersReducedMotion } from "@/lib/v3ShellMotion";
import { TRACK_TYPE_COLOR, TRACK_TYPE_ICON } from "./PitchStepCanvases";

type Phase = "upload" | "decoding" | "form";

type DecodeLine = {
  id: string;
  text: string;
  /** ms after the previous line */
  delay: number;
};

const DECODE_LINES: DecodeLine[] = [
  { id: "read", text: "Reading the brief…", delay: 500 },
  { id: "brand", text: "Detecting brand & project…", delay: 900 },
  { id: "cases", text: "Scanning deliverables & study cases…", delay: 1000 },
  {
    id: "plan",
    text: "Found 6 deliverable tracks — drafting your pitch setup…",
    delay: 1100,
  },
];

const FORM_REVEAL_AFTER_MS =
  DECODE_LINES.reduce((acc, line) => acc + line.delay, 0) + 900;

type EditableTrack = NewPitchTrackInput & { key: string };

let trackKeySeq = 0;
function nextTrackKey() {
  trackKeySeq += 1;
  return `nt-${trackKeySeq}`;
}

type NewPitchPageProps = {
  onOpenPitch: (pitchId: string) => void;
  onBackToPitchList: () => void;
};

export function NewPitchPage({
  onOpenPitch,
  onBackToPitchList,
}: NewPitchPageProps) {
  const { createPitch } = usePitch();

  const [phase, setPhase] = useState<Phase>("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [decodedCount, setDecodedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Suggestion form state — prefilled by the fake decode */
  const [brand, setBrand] = useState("");
  const [project, setProject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [pitchType, setPitchType] = useState("Competition Pitch");
  const [tracks, setTracks] = useState<EditableTrack[]>([]);
  const [error, setError] = useState<string | null>(null);

  const phaseRef = useRef<HTMLDivElement>(null);

  const startDecode = (name: string) => {
    setFileName(name);
    setPhase("decoding");
    setDecodedCount(0);
  };

  /* Staged decode lines, then prefill + reveal the form */
  useEffect(() => {
    if (phase !== "decoding") return;
    const timers: number[] = [];
    let elapsed = 0;
    DECODE_LINES.forEach((line, index) => {
      elapsed += line.delay;
      timers.push(
        window.setTimeout(() => setDecodedCount(index + 1), elapsed)
      );
    });
    timers.push(
      window.setTimeout(() => {
        setBrand(SUGGESTED_PITCH_FORM.brand);
        setProject(SUGGESTED_PITCH_FORM.project);
        setDeadline(SUGGESTED_PITCH_FORM.deadline);
        setPitchType(SUGGESTED_PITCH_FORM.pitchType);
        setTracks(
          SUGGESTED_TRACKS.map((track) => ({ ...track, key: nextTrackKey() }))
        );
        setPhase("form");
      }, FORM_REVEAL_AFTER_MS)
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [phase]);

  /* Phase entry transition */
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

  const updateTrack = (key: string, patch: Partial<NewPitchTrackInput>) => {
    setTracks((prev) =>
      prev.map((track) =>
        track.key === key ? { ...track, ...patch } : track
      )
    );
  };

  const removeTrack = (key: string) => {
    setTracks((prev) => prev.filter((track) => track.key !== key));
  };

  const addTrack = () => {
    setTracks((prev) => [
      ...prev,
      {
        key: nextTrackKey(),
        title: "New deliverable track",
        type: "campaign",
      },
    ]);
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
    if (tracks.some((track) => !track.title.trim())) {
      setError("Every track needs a name.");
      return;
    }
    const id = createPitch({
      brand,
      project,
      deadline,
      pitchType,
      tracks: tracks.map(({ title, type, summary }) => ({
        title: title.trim(),
        type,
        summary,
      })),
    });
    onOpenPitch(id);
  };

  const trackCounts = (["brand", "campaign", "content"] as PitchTrackType[])
    .map((type) => ({
      type,
      count: tracks.filter((track) => track.type === type).length,
    }))
    .filter((entry) => entry.count > 0);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-8 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <button
          type="button"
          onClick={onBackToPitchList}
          className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium text-text-inverse-subtle transition hover:text-text-inverse"
        >
          <ArrowLeft size={14} />
          Back to Pitches
        </button>

        <div className="mt-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtle">
            frndOS Pitch · New
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.4px] text-text-inverse">
            {phase === "form" ? "Review the pitch setup" : "Start a new pitch"}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-inverse-subtle">
            {phase === "form"
              ? "frndOS decoded the brief into a suggested setup. Adjust anything — brand, details and the deliverable tracks — before creating the pitch."
              : "Drop the client brief and frndOS will work out the brand, the study cases inside it, and the pitches you need to make."}
          </p>
        </div>

        <div ref={phaseRef} className="mt-8">
          {phase === "upload" && (
            <div className="flex flex-col gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) startDecode(file.name);
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
                  if (file) startDecode(file.name);
                }}
                className={`flex w-full flex-col items-center gap-3 rounded-md border border-dashed px-8 py-20 transition ${
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
                    PDF or DOCX — or click to browse
                  </p>
                </div>
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11px] font-medium text-text-inverse-subtle">
                  <Cpu size={13} className="text-sky-300" />
                  frndOS detects the brand, study cases and pitch tracks for you
                </span>
              </button>
              <button
                type="button"
                onClick={() => startDecode(IKEA_DECODE.briefFileName)}
                className="self-center text-xs font-medium text-sky-300 underline-offset-2 transition hover:underline"
              >
                Or use the sample brief (IKEA FY27)
              </button>
            </div>
          )}

          {phase === "decoding" && (
            <div className="rounded-md border border-line bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.10),_transparent_45%)] p-8">
              <div className="flex items-center gap-2.5">
                <Cpu size={18} className="animate-pulse text-sky-300" />
                <p className="text-sm font-medium text-text-inverse">
                  Decoding {fileName}
                </p>
              </div>
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
            </div>
          )}

          {phase === "form" && (
            <div className="flex flex-col gap-6 pb-16">
              <div className="rounded-md border border-line bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.10),_transparent_45%)] p-5">
                <div className="flex items-center gap-2">
                  <Sparkle size={15} className="text-sky-300" />
                  <p className="text-sm font-medium text-text-inverse">
                    Decoded from {fileName}
                  </p>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-text-inverse-subtle">
                  Brief essence: “{IKEA_DECODE.briefEssence}” ·{" "}
                  {IKEA_DECODE.projectType}. frndOS suggests{" "}
                  {tracks.length} deliverable track
                  {tracks.length === 1 ? "" : "s"} — everything below is
                  editable.
                </p>
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
                  <button
                    type="button"
                    onClick={addTrack}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11px] font-medium text-text-inverse-subtle transition hover:border-white/20 hover:text-text-inverse"
                  >
                    <Plus size={12} weight="bold" />
                    Add track
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {tracks.map((track, index) => (
                    <div
                      key={track.key}
                      className="flex items-center gap-3 rounded-md border border-line bg-white/[0.02] p-3"
                    >
                      <span className="w-8 shrink-0 text-center font-mono text-[10px] text-text-inverse-subtlest">
                        T{String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`flex size-7 shrink-0 items-center justify-center rounded-full ${TRACK_TYPE_COLOR[track.type]}`}
                      >
                        {TRACK_TYPE_ICON[track.type]}
                      </span>
                      <input
                        value={track.title}
                        onChange={(event) => {
                          updateTrack(track.key, {
                            title: event.target.value,
                          });
                          setError(null);
                        }}
                        aria-label={`Track ${index + 1} name`}
                        className="h-8 min-w-0 flex-1 rounded-sm border border-transparent bg-transparent px-2 text-sm text-text-inverse outline-none transition focus:border-white/30 focus:bg-white/[0.03]"
                      />
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
                  ))}
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
