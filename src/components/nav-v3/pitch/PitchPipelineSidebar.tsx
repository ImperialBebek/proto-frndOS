/** PROTOTYPE Pitch pipeline sidebar body — 4-stage pipeline with approval
 *  gating. The Work stage is broken out into one collapsible group per named
 *  deliverable track, each expanding to its sub-steps. */

"use client";

import { useState } from "react";
import { ArrowLeft, CaretDown, Check, Lock } from "@phosphor-icons/react";
import { usePitch } from "@/context/PitchProvider";
import {
  PITCH_ROLE_COLOR,
  PITCH_ROLE_LABEL,
  PITCH_STAGES,
  type PitchStageId,
  type PitchStepDef,
  type PitchTrackSubStepDef,
} from "@/data/pitchStatic";

type StepStatus = "locked" | "available" | "approved";

type PitchPipelineSidebarBodyProps = {
  pitchId: string;
  activeStepId: string | null;
  activeSubStepId?: string | null;
  onStepSelect: (stepId: string, subStepId?: string) => void;
  onBackToPitchList: () => void;
};

export function PitchPipelineSidebarBody({
  pitchId,
  activeStepId,
  activeSubStepId = null,
  onStepSelect,
  onBackToPitchList,
}: PitchPipelineSidebarBodyProps) {
  const {
    getPitch,
    getStepsForPitch,
    getStepStatus,
    getActiveStepId,
    getTrackSubProgress,
    getSubSteps,
    getSubStepStatus,
  } = usePitch();
  const pitch = getPitch(pitchId);
  const steps = getStepsForPitch(pitchId);
  const ongoingStepId = getActiveStepId(pitchId);
  const stepIndexById = new Map(
    steps.map((step, index) => [step.id, index + 1])
  );

  const [collapsedStages, setCollapsedStages] = useState<
    Partial<Record<PitchStageId, boolean>>
  >({});
  const [expandedTracks, setExpandedTracks] = useState<
    Record<string, boolean>
  >({});

  const toggleStage = (stageId: PitchStageId) => {
    setCollapsedStages((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
  };
  const toggleTrack = (trackId: string) => {
    setExpandedTracks((prev) => ({
      ...prev,
      [trackId]: !(prev[trackId] ?? trackId === activeStepId),
    }));
  };

  return (
    <>
      <div className="px-2 pb-1">
        <button
          type="button"
          onClick={onBackToPitchList}
          className="flex h-8 w-full items-center gap-2 rounded-sm px-2 text-sm font-medium tracking-[-0.14px] text-text-inverse-subtle transition-colors hover:bg-white/[0.03] hover:text-text-inverse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <ArrowLeft size={20} className="shrink-0" />
          Back to Pitches
        </button>
      </div>

      {pitch && (
        <div className="border-b border-white/[0.06] px-4 pb-4 pt-2">
          <span className="inline-flex rounded-full border border-white/[0.12] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtle">
            Campaign Pitch
          </span>
          <p className="mt-2 text-sm font-medium leading-snug tracking-[-0.14px] text-text-inverse">
            {pitch.brand} — {pitch.project}
          </p>
          <p className="mt-1 text-[11px] text-text-inverse-subtlest">
            Pitch Generator · 2 people · target 2 hrs
          </p>
        </div>
      )}

      <nav
        aria-label="Pitch pipeline"
        className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 py-3"
      >
        {PITCH_STAGES.map((stage, stageIndex) => {
          const stageSteps = steps.filter((step) => step.stageId === stage.id);
          const approvedCount = stageSteps.filter(
            (step) => getStepStatus(pitchId, step.id) === "approved"
          ).length;
          const collapsed = collapsedStages[stage.id] ?? false;
          const isWork = stage.id === "work";

          return (
            <div key={stage.id} className="flex flex-col gap-0.5 pb-2">
              <button
                type="button"
                onClick={() => toggleStage(stage.id)}
                aria-expanded={!collapsed}
                className="flex h-7 w-full items-center gap-2 rounded-sm px-2 text-[11px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtlest transition-colors hover:text-text-inverse-subtle"
              >
                <span className="font-mono text-[10px]">{stageIndex + 1}</span>
                <span className="min-w-0 flex-1 truncate text-left">
                  {stage.label}
                </span>
                {stage.comingSoon ? (
                  <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[9px] normal-case tracking-normal text-text-inverse-subtlest">
                    Soon
                  </span>
                ) : (
                  <span className="font-mono text-[10px] normal-case tracking-normal">
                    {approvedCount}/{stageSteps.length}
                  </span>
                )}
                <CaretDown
                  size={12}
                  className={`shrink-0 transition-transform ${
                    collapsed ? "-rotate-90" : "rotate-0"
                  }`}
                  aria-hidden
                />
              </button>

              {!collapsed &&
                (isWork
                  ? stageSteps.map((track) => {
                      const status = getStepStatus(pitchId, track.id);
                      const expanded =
                        expandedTracks[track.id] ?? track.id === activeStepId;
                      return (
                        <PipelineTrackGroup
                          key={track.id}
                          pitchId={track.id}
                          track={track}
                          status={status}
                          expanded={expanded && status !== "locked"}
                          subProgress={
                            status !== "locked"
                              ? getTrackSubProgress(pitchId, track.id)
                              : null
                          }
                          subSteps={getSubSteps(pitchId, track.id)}
                          getSubStatus={(subId) =>
                            getSubStepStatus(pitchId, track.id, subId)
                          }
                          isViewingTrack={activeStepId === track.id}
                          activeSubStepId={
                            activeStepId === track.id ? activeSubStepId : null
                          }
                          onToggle={() => toggleTrack(track.id)}
                          onSelect={onStepSelect}
                        />
                      );
                    })
                  : stageSteps.map((step) => {
                      const status = getStepStatus(pitchId, step.id);
                      return (
                        <PipelineStepRow
                          key={step.id}
                          step={step}
                          index={stepIndexById.get(step.id) ?? 0}
                          status={status}
                          isViewing={activeStepId === step.id}
                          isOngoing={
                            ongoingStepId === step.id && status === "available"
                          }
                          comingSoon={stage.comingSoon}
                          onSelect={() => onStepSelect(step.id)}
                        />
                      );
                    }))}
            </div>
          );
        })}

        <div className="mt-auto px-2 pt-4">
          <p className="pb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtlest">
            Legend
          </p>
          <div className="flex flex-col gap-1.5">
            {(Object.keys(PITCH_ROLE_LABEL) as Array<
              keyof typeof PITCH_ROLE_LABEL
            >).map((role) => (
              <div
                key={role}
                className="flex items-center gap-2 text-[11px] text-text-inverse-subtlest"
              >
                <span
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: PITCH_ROLE_COLOR[role] }}
                />
                {PITCH_ROLE_LABEL[role]}
                {role === "sc" && " — Strategic Consultant"}
                {role === "ce" && " — Creative Executor"}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Per-track collapsible group (Work stage)                            */
/* ------------------------------------------------------------------ */

function PipelineTrackGroup({
  track,
  status,
  expanded,
  subProgress,
  subSteps,
  getSubStatus,
  isViewingTrack,
  activeSubStepId,
  onToggle,
  onSelect,
}: {
  pitchId: string;
  track: PitchStepDef;
  status: StepStatus;
  expanded: boolean;
  subProgress: { approved: number; total: number } | null;
  subSteps: readonly PitchTrackSubStepDef[];
  getSubStatus: (subId: string) => StepStatus;
  isViewingTrack: boolean;
  activeSubStepId: string | null;
  onToggle: () => void;
  onSelect: (stepId: string, subStepId?: string) => void;
}) {
  const locked = status === "locked";

  return (
    <div className="flex flex-col gap-0.5">
      <div
        className={`flex h-8 w-full items-center gap-1 rounded-sm pr-2 transition-colors ${
          isViewingTrack && !activeSubStepId
            ? "bg-[var(--nav-active)] text-text-inverse"
            : locked
              ? "text-text-inverse-subtlest opacity-50"
              : "text-text-inverse-subtle hover:bg-[var(--nav-hover)] hover:text-text-inverse"
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          disabled={locked}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse track" : "Expand track"}
          className="flex size-6 shrink-0 items-center justify-center rounded-sm text-text-inverse-subtlest transition hover:text-text-inverse disabled:opacity-40"
        >
          <CaretDown
            size={12}
            className={`transition-transform ${expanded ? "rotate-0" : "-rotate-90"}`}
          />
        </button>
        <button
          type="button"
          onClick={() => (locked ? undefined : onSelect(track.id))}
          disabled={locked}
          className="flex min-w-0 flex-1 items-center gap-2 text-left text-[13px] font-medium tracking-[-0.14px]"
        >
          <span
            className="size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: PITCH_ROLE_COLOR[track.role] }}
            aria-hidden
          />
          <span className="min-w-0 flex-1 truncate">{track.label}</span>
          {subProgress ? (
            <span className="shrink-0 font-mono text-[9px] text-text-inverse-subtlest">
              {subProgress.approved}/{subProgress.total}
            </span>
          ) : null}
          <TrackStatusIcon status={status} />
        </button>
      </div>

      {expanded && !locked && (
        <div className="ml-3 flex flex-col gap-0.5 border-l border-white/[0.06] pl-2">
          {subSteps.map((sub, subIndex) => {
            const subStatus = getSubStatus(sub.id);
            const isViewing =
              isViewingTrack && activeSubStepId === sub.id;
            const subLocked = subStatus === "locked";
            return (
              <button
                key={sub.id}
                type="button"
                disabled={subLocked && !isViewing}
                onClick={() => onSelect(track.id, sub.id)}
                aria-current={isViewing ? "page" : undefined}
                className={`flex h-7 w-full items-center gap-2 rounded-sm px-2 text-left text-[12px] tracking-[-0.14px] transition-colors ${
                  isViewing
                    ? "bg-[var(--nav-active)] text-text-inverse"
                    : subLocked
                      ? "cursor-not-allowed text-text-inverse-subtlest opacity-50"
                      : "text-text-inverse-subtle hover:bg-[var(--nav-hover)] hover:text-text-inverse"
                }`}
              >
                <span className="w-4 shrink-0 font-mono text-[9px] text-text-inverse-subtlest">
                  {String(subIndex + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 truncate">{sub.label}</span>
                <TrackStatusIcon status={subStatus} small />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TrackStatusIcon({
  status,
  small = false,
}: {
  status: StepStatus;
  small?: boolean;
}) {
  const size = small ? 8 : 9;
  if (status === "approved") {
    return (
      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
        <Check size={size} weight="bold" />
      </span>
    );
  }
  if (status === "locked") {
    return (
      <span className="flex size-4 shrink-0 items-center justify-center text-text-inverse-subtlest">
        <Lock size={small ? 9 : 11} />
      </span>
    );
  }
  return (
    <span className="flex size-4 shrink-0 items-center justify-center">
      <span className="size-1.5 rounded-full border border-text-inverse-subtlest" />
    </span>
  );
}

function PipelineStepRow({
  step,
  index,
  status,
  isViewing,
  isOngoing,
  comingSoon,
  onSelect,
}: {
  step: PitchStepDef;
  index: number;
  status: StepStatus;
  isViewing: boolean;
  isOngoing: boolean;
  comingSoon?: boolean;
  onSelect: () => void;
}) {
  const locked = status === "locked" || comingSoon;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={locked && !isViewing}
      aria-current={isViewing ? "page" : undefined}
      className={`flex h-8 w-full items-center gap-2 rounded-sm px-2 text-sm font-medium tracking-[-0.14px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
        isViewing
          ? "bg-[var(--nav-active)] text-text-inverse"
          : locked
            ? "cursor-not-allowed text-text-inverse-subtlest opacity-50"
            : "text-text-inverse-subtle hover:bg-[var(--nav-hover)] hover:text-text-inverse"
      }`}
    >
      <span className="w-5 shrink-0 font-mono text-[10px] text-text-inverse-subtlest">
        {String(index).padStart(2, "0")}
      </span>
      <span
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: PITCH_ROLE_COLOR[step.role] }}
        aria-hidden
      />
      <span className="min-w-0 flex-1 truncate text-left text-[13px]">
        {step.label}
      </span>
      {step.timeEstimate ? (
        <span className="shrink-0 font-mono text-[9px] text-text-inverse-subtlest">
          {step.timeEstimate}
        </span>
      ) : null}
      <StepStatusIcon status={status} isOngoing={isOngoing} locked={locked} />
    </button>
  );
}

function StepStatusIcon({
  status,
  isOngoing,
  locked,
}: {
  status: StepStatus;
  isOngoing: boolean;
  locked?: boolean;
}) {
  if (status === "approved") {
    return (
      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
        <Check size={9} weight="bold" />
      </span>
    );
  }
  if (locked) {
    return (
      <span className="flex size-4 shrink-0 items-center justify-center text-text-inverse-subtlest">
        <Lock size={11} />
      </span>
    );
  }
  if (isOngoing) {
    return (
      <span className="relative flex size-4 shrink-0 items-center justify-center">
        <span className="absolute size-2 animate-ping rounded-full bg-primary-400/50" />
        <span className="relative size-1.5 rounded-full bg-primary-400" />
      </span>
    );
  }
  return (
    <span className="flex size-4 shrink-0 items-center justify-center">
      <span className="size-1.5 rounded-full border border-text-inverse-subtlest" />
    </span>
  );
}
