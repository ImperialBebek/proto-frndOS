/** PROTOTYPE Work hub — overview screen for the parallel deliverable tracks */

"use client";

import {
  ArrowRight,
  Check,
  FlagBanner,
  Lock,
  SealCheck,
} from "@phosphor-icons/react";
import { usePitch } from "@/context/PitchProvider";
import {
  PITCH_STAGES,
  PITCH_TRACK_TYPE_LABEL,
} from "@/data/pitchStatic";
import { TRACK_TYPE_COLOR, TRACK_TYPE_ICON } from "./PitchStepCanvases";

type WorkHubCanvasProps = {
  pitchId: string;
  onOpenTrack: (trackStepId: string) => void;
  onOpenDecking: (deckStepId: string) => void;
};

export function WorkHubCanvas({
  pitchId,
  onOpenTrack,
  onOpenDecking,
}: WorkHubCanvasProps) {
  const {
    getStepsForPitch,
    getStepStatus,
    getTrackSubProgress,
    isStepApproved,
  } = usePitch();

  const steps = getStepsForPitch(pitchId);
  const trackSteps = steps.filter((step) => step.kind === "track");
  const deckStep = steps.find((step) => step.kind === "decking");
  const stage = PITCH_STAGES.find((item) => item.id === "work");

  const approvedCount = trackSteps.filter((track) =>
    isStepApproved(pitchId, track.id)
  ).length;
  const allApproved =
    trackSteps.length > 0 && approvedCount === trackSteps.length;
  const foundationLocked = trackSteps.every(
    (track) => getStepStatus(pitchId, track.id) === "locked"
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtlest">
          Work stage
        </p>
        <h2 className="mt-1.5 text-2xl font-semibold tracking-[-0.3px] text-text-inverse">
          Deliverable tracks
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-inverse-subtle">
          {stage?.description} Each track runs through its own 3-step
          sub-pipeline — work them in any order.
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11px] font-medium text-text-inverse-subtle">
          {approvedCount} of {trackSteps.length} tracks approved
        </span>
      </div>

      {foundationLocked && (
        <div className="flex items-center gap-3 rounded-md border border-amber-400/30 bg-amber-500/[0.06] px-4 py-3">
          <Lock size={16} className="shrink-0 text-amber-300" />
          <p className="text-sm text-amber-200">
            The work tracks unlock when the Foundational stage is approved —
            the shared Research, Strategy and Big Idea feed every track.
          </p>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {trackSteps.map((track, index) => {
          const status = getStepStatus(pitchId, track.id);
          const progress = getTrackSubProgress(pitchId, track.id);
          const locked = status === "locked";
          const percent =
            progress.total > 0
              ? Math.round((progress.approved / progress.total) * 100)
              : 0;

          return (
            <button
              key={track.id}
              type="button"
              disabled={locked}
              onClick={() => onOpenTrack(track.id)}
              className={`group flex flex-col gap-3 rounded-md border p-5 text-left transition ${
                locked
                  ? "cursor-not-allowed border-line bg-white/[0.01] opacity-50"
                  : status === "approved"
                    ? "border-emerald-400/30 bg-emerald-500/[0.04] hover:border-emerald-400/50"
                    : "border-line bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                {track.trackType && (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${TRACK_TYPE_COLOR[track.trackType]}`}
                  >
                    {TRACK_TYPE_ICON[track.trackType]}
                    {PITCH_TRACK_TYPE_LABEL[track.trackType]}
                  </span>
                )}
                <span className="font-mono text-[10px] text-text-inverse-subtlest">
                  T{String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-text-inverse">
                  {track.label}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-inverse-subtle">
                  {track.summary}
                </p>
              </div>

              <div className="mt-auto">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-inverse-subtle">
                    {progress.approved} of {progress.total} sub-steps
                  </span>
                  {status === "approved" ? (
                    <span className="inline-flex items-center gap-1 font-medium text-emerald-300">
                      <SealCheck size={12} weight="fill" />
                      Approved
                    </span>
                  ) : locked ? (
                    <Lock size={12} className="text-text-inverse-subtlest" />
                  ) : (
                    <span className="inline-flex items-center gap-1 text-text-inverse-subtle transition group-hover:text-text-inverse">
                      Open
                      <ArrowRight size={12} />
                    </span>
                  )}
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className={`h-full rounded-full ${
                      status === "approved" ? "bg-emerald-400" : "bg-sky-400"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {allApproved && deckStep && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-emerald-400/30 bg-emerald-500/[0.05] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
              <FlagBanner size={18} />
            </span>
            <div>
              <p className="text-sm font-medium text-text-inverse">
                Every track is approved
              </p>
              <p className="text-xs text-text-inverse-subtle">
                The Decking stage is unlocked — assemble and export the
                presentation.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenDecking(deckStep.id)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition hover:bg-white/90"
          >
            <Check size={14} weight="bold" />
            Continue to Decking
          </button>
        </div>
      )}
    </div>
  );
}
