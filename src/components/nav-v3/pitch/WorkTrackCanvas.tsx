/** PROTOTYPE Work track canvas — focused screen for one sub-step of a deliverable track */

"use client";

import { Fragment } from "react";
import {
  ArrowLeft,
  Check,
  FlagBanner,
  Lock,
} from "@phosphor-icons/react";
import { usePitch } from "@/context/PitchProvider";
import {
  PITCH_TRACK_TYPE_LABEL,
  type PitchStepDef,
} from "@/data/pitchStatic";
import { TRACK_TYPE_COLOR, TRACK_TYPE_ICON } from "./PitchStepCanvases";
import { TrackSubStepCanvas } from "./PitchTrackSubCanvases";

type WorkTrackCanvasProps = {
  pitchId: string;
  step: PitchStepDef;
  activeSubStepId: string | null;
  onSubStepSelect: (subStepId: string) => void;
  onBackToHub: () => void;
};

export function WorkTrackCanvas({
  pitchId,
  step,
  activeSubStepId,
  onSubStepSelect,
  onBackToHub,
}: WorkTrackCanvasProps) {
  const { getStepStatus, getSubStepStatus, getSubSteps } = usePitch();

  const trackStatus = getStepStatus(pitchId, step.id);
  const locked = trackStatus === "locked";
  const subSteps = getSubSteps(pitchId, step.id);

  const activeSub =
    subSteps.find((sub) => sub.id === activeSubStepId) ?? subSteps[0];
  const activeIndex = activeSub
    ? subSteps.findIndex((sub) => sub.id === activeSub.id)
    : -1;
  const activeSubStatus = activeSub
    ? getSubStepStatus(pitchId, step.id, activeSub.id)
    : "locked";

  return (
    <div className="flex flex-col gap-5">
      <div>
        <button
          type="button"
          onClick={onBackToHub}
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-text-inverse-subtle transition hover:text-text-inverse"
        >
          <ArrowLeft size={13} />
          All work tracks
        </button>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {step.trackType && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${TRACK_TYPE_COLOR[step.trackType]}`}
            >
              {TRACK_TYPE_ICON[step.trackType]}
              {PITCH_TRACK_TYPE_LABEL[step.trackType]}
            </span>
          )}
          <h3 className="text-lg font-medium text-text-inverse">
            {step.label}
          </h3>
        </div>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-text-inverse-subtle">
          {step.summary}
        </p>
      </div>

      {locked && (
        <div className="flex items-center gap-3 rounded-md border border-amber-400/30 bg-amber-500/[0.06] px-4 py-3">
          <Lock size={16} className="shrink-0 text-amber-300" />
          <p className="text-sm text-amber-200">
            This track unlocks when the Foundational stage is approved — the
            shared Research, Strategy and Big Idea feed every work track.
          </p>
        </div>
      )}

      <div>
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtlest">
          Track pipeline
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {subSteps.map((sub, index) => {
            const status = locked
              ? "locked"
              : getSubStepStatus(pitchId, step.id, sub.id);
            const isActive = !locked && sub.id === activeSub?.id;
            const disabled = locked || status === "locked";

            return (
              <Fragment key={sub.id}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onSubStepSelect(sub.id)}
                  aria-current={isActive ? "step" : undefined}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    isActive
                      ? "border-white/25 bg-white/[0.08] text-text-inverse"
                      : disabled
                        ? "cursor-not-allowed border-line text-text-inverse-subtlest opacity-60"
                        : "border-line text-text-inverse-subtle hover:border-white/20 hover:text-text-inverse"
                  }`}
                >
                  {status === "approved" ? (
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                      <Check size={9} weight="bold" />
                    </span>
                  ) : status === "locked" ? (
                    <Lock size={12} className="shrink-0" />
                  ) : (
                    <span className="font-mono text-[10px] text-text-inverse-subtlest">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  )}
                  {sub.label}
                </button>
                {index < subSteps.length - 1 && (
                  <span className="h-px w-4 shrink-0 bg-line" aria-hidden />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>

      {locked ? (
        <div className="grid gap-3 md:grid-cols-3">
          {subSteps.map((sub, index) => (
            <div
              key={sub.id}
              className="rounded-md border border-dashed border-line bg-white/[0.01] p-4 opacity-50"
            >
              <span className="font-mono text-[10px] text-text-inverse-subtlest">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-1.5 text-sm font-medium text-text-inverse-subtle">
                {sub.label}
              </p>
              <p className="mt-1 text-[11px] text-text-inverse-subtlest">
                {sub.summary}
              </p>
            </div>
          ))}
        </div>
      ) : activeSub && activeSubStatus === "locked" ? (
        <div className="flex flex-col items-center gap-4 rounded-md border border-line bg-white/[0.02] px-8 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-white/[0.05] text-text-inverse-subtle">
            <Lock size={22} />
          </span>
          <div>
            <h3 className="text-base font-medium text-text-inverse">
              {activeSub.label} is locked
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-inverse-subtle">
              {activeSub.summary}
            </p>
          </div>
          {activeIndex > 0 && (
            <p className="text-[11px] text-text-inverse-subtlest">
              Approve {subSteps[activeIndex - 1].label} first.
            </p>
          )}
        </div>
      ) : activeSub ? (
        <>
          <TrackSubStepCanvas
            trackStepId={step.id}
            subStepId={activeSub.id}
            trackType={step.trackType}
          />
          {trackStatus === "approved" && (
            <div className="flex items-center gap-2 rounded-md border border-line bg-white/[0.02] px-4 py-3 text-sm text-text-inverse-subtle">
              <FlagBanner size={16} className="shrink-0 text-emerald-300" />
              Every sub-step is approved — this track is complete and feeds the
              final presentation.
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
