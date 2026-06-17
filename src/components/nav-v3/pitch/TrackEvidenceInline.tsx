/** PROTOTYPE Inline collapsible evidence cards — Variant 2 for Review Setup */

"use client";

import { useState } from "react";
import { CaretDown, CaretUp, Brain } from "@phosphor-icons/react";
import { PITCH_TRACK_TYPE_LABEL } from "@/data/pitchStatic";
import { TRACK_TYPE_COLOR, TRACK_TYPE_ICON } from "./PitchStepCanvases";
import type { ReasoningTrack } from "./TrackReasoningDrawer";
import {
  BriefSourceSection,
  EvidenceChecklist,
  EvidenceStrengthBadge,
  EvidenceStrengthMeter,
} from "./TrackEvidenceShared";

/** Expandable panel nested under an editable track row */
export function TrackEvidenceInlinePanel({ track }: { track: ReasoningTrack }) {
  return (
    <div className="rounded-b-md border border-t-0 border-line bg-white/[0.015] px-4 py-4">
      <div className="flex flex-col gap-4">
        {track.summary && (
          <p className="text-xs leading-relaxed text-text-inverse-subtle">
            {track.summary}
          </p>
        )}

        <EvidenceStrengthMeter track={track} />

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Brain size={14} className="text-sky-300" />
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-text-inverse-subtle">
              Why the AI suggested this track
            </p>
          </div>
          <p className="text-sm leading-relaxed text-text-inverse-subtle">
            {track.reasoning ??
              "Detected from the deliverables and objectives in the brief."}
          </p>
        </div>

        <BriefSourceSection track={track} />

        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-text-inverse-subtle">
            Evidence checklist
          </p>
          <EvidenceChecklist track={track} />
        </div>
      </div>
    </div>
  );
}

export function TrackEvidenceInlineCard({
  track,
  index,
  defaultOpen = false,
}: {
  track: ReasoningTrack;
  index: number;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-md border border-line bg-white/[0.015]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-white/[0.03]"
        aria-expanded={open}
      >
        <span className="w-6 shrink-0 text-center font-mono text-[10px] text-text-inverse-subtlest">
          T{String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`flex size-6 shrink-0 items-center justify-center rounded-full ${TRACK_TYPE_COLOR[track.type]}`}
        >
          {TRACK_TYPE_ICON[track.type]}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-text-inverse">{track.title}</p>
          <p className="text-[10px] text-text-inverse-subtlest">
            {track.planLabel ?? PITCH_TRACK_TYPE_LABEL[track.type]}
          </p>
        </div>
        <EvidenceStrengthBadge track={track} />
        {open ? (
          <CaretUp size={14} className="shrink-0 text-text-inverse-subtlest" />
        ) : (
          <CaretDown size={14} className="shrink-0 text-text-inverse-subtlest" />
        )}
      </button>

      {open && (
        <div className="flex flex-col gap-4 border-t border-line/60 px-4 py-4">
          {track.summary && (
            <p className="text-xs leading-relaxed text-text-inverse-subtle">
              {track.summary}
            </p>
          )}

          <EvidenceStrengthMeter track={track} />

          <div>
            <div className="mb-2 flex items-center gap-2">
              <Brain size={14} className="text-sky-300" />
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-text-inverse-subtle">
                Why the AI suggested this track
              </p>
            </div>
            <p className="text-sm leading-relaxed text-text-inverse-subtle">
              {track.reasoning ??
                "Detected from the deliverables and objectives in the brief."}
            </p>
          </div>

          <BriefSourceSection track={track} />

          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-text-inverse-subtle">
              Evidence checklist
            </p>
            <EvidenceChecklist track={track} />
          </div>
        </div>
      )}
    </div>
  );
}

export function TrackEvidenceInlineList({
  tracks,
}: {
  tracks: ReasoningTrack[];
}) {
  if (tracks.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {tracks.map((track, index) => (
        <TrackEvidenceInlineCard
          key={`${track.title}-${index}`}
          track={track}
          index={index}
          defaultOpen={index === 0}
        />
      ))}
    </div>
  );
}
