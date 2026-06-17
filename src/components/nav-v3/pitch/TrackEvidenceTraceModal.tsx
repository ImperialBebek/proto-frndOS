/** PROTOTYPE AI Trace Map modal — Variant 3 comparing all track evidence */

"use client";

import { useEffect } from "react";
import {
  Brain,
  GitBranch,
  Quotes,
  X,
} from "@phosphor-icons/react";
import {
  PITCH_TRACK_TYPE_LABEL,
} from "@/data/pitchStatic";
import { resolveTrackEvidence } from "@/lib/pitch/trackEvidence";
import { TRACK_TYPE_COLOR, TRACK_TYPE_ICON } from "./PitchStepCanvases";
import type { ReasoningTrack } from "./TrackReasoningDrawer";
import {
  EvidenceStrengthBadge,
  EvidenceChecklist,
} from "./TrackEvidenceShared";

export function TrackEvidenceTraceModal({
  tracks,
  briefEssence,
  onClose,
}: {
  tracks: ReasoningTrack[];
  briefEssence?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const strengthOrder = { high: 0, medium: 1, low: 2 };
  const sorted = [...tracks].sort(
    (a, b) =>
      strengthOrder[resolveTrackEvidence(a).strength] -
      strengthOrder[resolveTrackEvidence(b).strength]
  );

  const counts = tracks.reduce(
    (acc, t) => {
      const s = resolveTrackEvidence(t).strength;
      acc[s] += 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="trace-map-title"
        className="relative flex max-h-[min(88vh,720px)] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-line bg-card-bg shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <GitBranch size={18} className="text-sky-300" />
              <h2
                id="trace-map-title"
                className="text-base font-semibold tracking-[-0.2px] text-text-inverse"
              >
                AI evidence map
              </h2>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-text-inverse-subtle">
              How each deliverable track maps back to the brief — sorted by
              evidence strength.
            </p>
            {briefEssence && (
              <p className="mt-2 text-[11px] italic text-text-inverse-subtlest">
                Brief essence: “{briefEssence}”
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 shrink-0 items-center justify-center rounded-sm text-text-inverse-subtlest transition hover:bg-white/[0.06] hover:text-text-inverse"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-line/60 px-6 py-3">
          <SummaryPill label="High" count={counts.high} tone="high" />
          <SummaryPill label="Medium" count={counts.medium} tone="medium" />
          <SummaryPill label="Low" count={counts.low} tone="low" />
          <span className="ml-auto text-[11px] text-text-inverse-subtlest">
            {tracks.length} track{tracks.length === 1 ? "" : "s"} detected
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="relative flex flex-col gap-0">
            <div
              className="absolute bottom-4 left-[11px] top-4 w-px bg-white/10"
              aria-hidden
            />
            {sorted.map((track, index) => (
              <TraceRow
                key={`${track.title}-${index}`}
                track={track}
                index={tracks.indexOf(track)}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-line px-6 py-3">
          <p className="text-[11px] leading-relaxed text-text-inverse-subtlest">
            Low-confidence tracks are strategic inferences — validate with the
            client before committing scope.
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryPill({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "high" | "medium" | "low";
}) {
  const toneClass =
    tone === "high"
      ? "text-emerald-300 bg-emerald-500/10"
      : tone === "medium"
        ? "text-amber-300 bg-amber-500/10"
        : "text-violet-300 bg-violet-500/10";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${toneClass}`}
    >
      {count} {label}
    </span>
  );
}

function TraceRow({ track, index }: { track: ReasoningTrack; index: number }) {
  const evidence = resolveTrackEvidence(track);

  return (
    <div className="relative grid gap-3 pb-6 pl-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div
        className={`absolute left-2 top-1.5 size-2.5 rounded-full ring-2 ring-card-bg ${
          evidence.strength === "high"
            ? "bg-emerald-400"
            : evidence.strength === "medium"
              ? "bg-amber-400"
              : "bg-violet-400"
        }`}
        aria-hidden
      />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] text-text-inverse-subtlest">
            T{String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${TRACK_TYPE_COLOR[track.type]}`}
          >
            {TRACK_TYPE_ICON[track.type]}
            {track.planLabel ?? PITCH_TRACK_TYPE_LABEL[track.type]}
          </span>
          <EvidenceStrengthBadge track={track} />
        </div>
        <p className="mt-1.5 text-sm font-medium text-text-inverse">
          {track.title}
        </p>
        {track.summary && (
          <p className="mt-1 text-xs leading-relaxed text-text-inverse-subtle">
            {track.summary}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-line bg-white/[0.02] p-3">
        <div className="flex items-start gap-2">
          <Brain size={13} className="mt-0.5 shrink-0 text-sky-300" />
          <p className="text-xs leading-relaxed text-text-inverse-subtle">
            {track.reasoning ??
              "Detected from the deliverables and objectives in the brief."}
          </p>
        </div>

        {track.sourceExcerpt && (
          <div className="flex items-start gap-2">
            <Quotes size={13} className="mt-0.5 shrink-0 text-amber-300" />
            <div className="min-w-0">
              <p className="text-xs italic leading-relaxed text-amber-100/90">
                {track.sourceExcerpt}
              </p>
              {track.sourcePage && (
                <p className="mt-1 text-[10px] text-text-inverse-subtlest">
                  {track.sourcePage}
                </p>
              )}
            </div>
          </div>
        )}

        <EvidenceChecklist track={track} />
      </div>
    </div>
  );
}
