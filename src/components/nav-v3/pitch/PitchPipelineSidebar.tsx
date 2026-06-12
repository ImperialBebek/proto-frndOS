/** PROTOTYPE Pitch pipeline sidebar body — 4-stage pipeline with approval gating */

"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CaretDown,
  Check,
  Lock,
} from "@phosphor-icons/react";
import { usePitch } from "@/context/PitchProvider";
import {
  PITCH_ROLE_COLOR,
  PITCH_ROLE_LABEL,
  PITCH_STAGES,
  type PitchStageId,
  type PitchStepDef,
} from "@/data/pitchStatic";

type PitchPipelineSidebarBodyProps = {
  pitchId: string;
  activeStepId: string | null;
  onStepSelect: (stepId: string) => void;
  onBackToPitchList: () => void;
};

export function PitchPipelineSidebarBody({
  pitchId,
  activeStepId,
  onStepSelect,
  onBackToPitchList,
}: PitchPipelineSidebarBodyProps) {
  const {
    getPitch,
    getStepsForPitch,
    getStepStatus,
    getActiveStepId,
    getTrackSubProgress,
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

  const toggleStage = (stageId: PitchStageId) => {
    setCollapsedStages((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
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
          const stageSteps = steps.filter(
            (step) => step.stageId === stage.id
          );
          const approvedCount = stageSteps.filter(
            (step) => getStepStatus(pitchId, step.id) === "approved"
          ).length;
          const collapsed = collapsedStages[stage.id] ?? false;

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
                stageSteps.map((step) => {
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
                      subProgress={
                        step.kind === "track" && status !== "locked"
                          ? getTrackSubProgress(pitchId, step.id)
                          : null
                      }
                      onSelect={() => onStepSelect(step.id)}
                    />
                  );
                })}
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

function PipelineStepRow({
  step,
  index,
  status,
  isViewing,
  isOngoing,
  comingSoon,
  subProgress,
  onSelect,
}: {
  step: PitchStepDef;
  index: number;
  status: "locked" | "available" | "approved";
  isViewing: boolean;
  isOngoing: boolean;
  comingSoon?: boolean;
  subProgress?: { approved: number; total: number } | null;
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
      {subProgress ? (
        <span className="shrink-0 font-mono text-[9px] text-text-inverse-subtlest">
          {subProgress.approved}/{subProgress.total}
        </span>
      ) : step.timeEstimate ? (
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
  status: "locked" | "available" | "approved";
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
