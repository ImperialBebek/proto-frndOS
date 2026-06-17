/** PROTOTYPE Track reasoning drawer — shows WHY the AI detected a track and
 *  WHERE in the brief it came from. Shared by Review Setup + Pitch Plan. */

"use client";

import { useEffect } from "react";
import { Brain, ListChecks, X } from "@phosphor-icons/react";
import {
  PITCH_TRACK_TYPE_LABEL,
  type EvidenceStrength,
  type PitchTrackType,
} from "@/data/pitchStatic";
import { TRACK_TYPE_COLOR, TRACK_TYPE_ICON } from "./PitchStepCanvases";
import {
  BriefSourceSection,
  EvidenceChecklist,
  EvidenceStrengthBadge,
  EvidenceStrengthMeter,
} from "./TrackEvidenceShared";

export type ReasoningTrack = {
  type: PitchTrackType;
  planLabel?: string;
  title: string;
  summary?: string;
  reasoning?: string;
  sourceExcerpt?: string;
  sourcePage?: string;
  evidenceStrength?: EvidenceStrength;
  evidenceSignals?: string[];
};

export function TrackReasoningDrawer({
  track,
  onClose,
}: {
  track: ReasoningTrack | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!track) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [track, onClose]);

  if (!track) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
      />
      <aside className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-line bg-card-bg shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${TRACK_TYPE_COLOR[track.type]}`}
              >
                {TRACK_TYPE_ICON[track.type]}
                {track.planLabel ?? PITCH_TRACK_TYPE_LABEL[track.type]}
              </span>
              <EvidenceStrengthBadge track={track} size="md" />
            </div>
            <h3 className="mt-2 text-base font-semibold tracking-[-0.2px] text-text-inverse">
              {track.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-7 shrink-0 items-center justify-center rounded-sm text-text-inverse-subtlest transition hover:bg-white/[0.06] hover:text-text-inverse"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex flex-col gap-5 px-5 py-5">
          {track.summary && (
            <p className="text-sm leading-relaxed text-text-inverse-subtle">
              {track.summary}
            </p>
          )}

          <EvidenceStrengthMeter track={track} />

          <Section
            icon={<Brain size={14} className="text-sky-300" />}
            title="AI read this as"
          >
            <p className="text-sm leading-relaxed text-text-inverse-subtle">
              {track.reasoning ??
                "Detected from the deliverables and objectives in the brief."}
            </p>
          </Section>

          <BriefSourceSection track={track} />

          <Section
            icon={<ListChecks size={14} className="text-emerald-300" />}
            title="Evidence checklist"
          >
            <EvidenceChecklist track={track} />
          </Section>

          <div className="rounded-md border border-line bg-white/[0.02] px-3 py-2.5">
            <p className="text-[11px] leading-relaxed text-text-inverse-subtlest">
              AI confidence reflects how directly the brief supports this track —
              not creative quality. The concept is still yours to build.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-text-inverse-subtle">
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}
