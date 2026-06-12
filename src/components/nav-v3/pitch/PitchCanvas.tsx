/** PROTOTYPE Pitch canvas — immersive step-per-screen session with a stage stepper header */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowCounterClockwise,
  ArrowLeft,
  Chat,
  Check,
  CheckCircle,
  Cpu,
  Lock,
  SealCheck,
  SidebarSimple,
  Warning,
  X,
} from "@phosphor-icons/react";
import { usePitch } from "@/context/PitchProvider";
import {
  IKEA_DECODE,
  PITCH_ROLE_COLOR,
  PITCH_ROLE_LABEL,
  PITCH_STAGES,
  PITCH_WORK_HUB_ID,
  type PitchStageDef,
  type PitchStageId,
  type PitchStepDef,
} from "@/data/pitchStatic";
import { prefersReducedMotion } from "@/lib/v3ShellMotion";
import {
  BigIdeasCanvas,
  BriefDecoderCanvas,
  CommStrategyCanvas,
  LockedStepCanvas,
  PitchPlanCanvas,
  Research4CCanvas,
} from "./PitchStepCanvases";
import { WorkHubCanvas } from "./WorkHubCanvas";
import { WorkTrackCanvas } from "./WorkTrackCanvas";
import { PitchExportCanvas } from "./PitchExportCanvas";

const BRIEF_SECTION_COUNT = IKEA_DECODE.businessBrief.length;
const DECODE_TICK_MS = 1100;

type StageState = "approved" | "active" | "available" | "locked";

type PitchCanvasProps = {
  pitchId: string;
  /** Resolved step id — may be the Work hub pseudo-step */
  stepId: string | null;
  activeSubStepId: string | null;
  onSubStepSelect: (subStepId: string) => void;
  onNavigateStep: (stepId: string, subStepId?: string) => void;
  onBackToPitchList: () => void;
  /** Immersive header owns the shell top row in pitch sessions */
  sidebarOpen: boolean;
  hamburgerRef: React.Ref<HTMLButtonElement>;
  onHamburgerEnter: () => void;
  onHamburgerLeave: () => void;
  chatOpen: boolean;
  onChatToggle: () => void;
};

export function PitchCanvas({
  pitchId,
  stepId,
  activeSubStepId,
  onSubStepSelect,
  onNavigateStep,
  onBackToPitchList,
  sidebarOpen,
  hamburgerRef,
  onHamburgerEnter,
  onHamburgerLeave,
  chatOpen,
  onChatToggle,
}: PitchCanvasProps) {
  const {
    getPitch,
    getStepsForPitch,
    getStepDef,
    getSubSteps,
    getStepStatus,
    getSubStepStatus,
    getActiveStepId,
    getApprovedSteps,
    approveStep,
    approveSubStep,
    reopenStep,
    markDecoded,
    isStepApproved,
  } = usePitch();

  const pitch = getPitch(pitchId);
  const steps = getStepsForPitch(pitchId);

  const isHub = stepId === PITCH_WORK_HUB_ID;
  const effectiveStepId =
    stepId ?? (pitch ? getActiveStepId(pitchId) : null);
  const step =
    !isHub && effectiveStepId
      ? getStepDef(pitchId, effectiveStepId)
      : undefined;

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [reopenModalOpen, setReopenModalOpen] = useState(false);

  /* ---------------- scripted decode reveal ---------------- */
  const isDecoding = Boolean(
    pitch?.newlyCreated && step?.id === "brief-decoder"
  );
  const [revealCount, setRevealCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isDecoding) {
      setRevealCount(null);
      return;
    }
    setRevealCount(0);
    let current = 0;
    const interval = window.setInterval(() => {
      current += 1;
      setRevealCount(current);
      if (current >= BRIEF_SECTION_COUNT) {
        window.clearInterval(interval);
        window.setTimeout(() => markDecoded(pitchId), 800);
      }
    }, DECODE_TICK_MS);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDecoding, pitchId]);

  const decodeInProgress =
    isDecoding && (revealCount ?? 0) < BRIEF_SECTION_COUNT;

  /* ---------------- step-per-screen entry transition ---------------- */
  const screenRef = useRef<HTMLDivElement>(null);
  const screenKey = `${stepId ?? "auto"}:${activeSubStepId ?? ""}`;

  useGSAP(
    () => {
      const node = screenRef.current;
      if (!node) return;
      if (prefersReducedMotion()) {
        gsap.set(node, { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        node,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    },
    { dependencies: [screenKey] }
  );

  /* ---------------- derived state ---------------- */
  const status = step ? getStepStatus(pitchId, step.id) : "locked";
  const currentStageId: PitchStageId | null = isHub
    ? "work"
    : (step?.stageId ?? null);

  const unlocksNext = useMemo(() => {
    if (!step) return [];
    return steps.filter(
      (candidate) =>
        candidate.dependsOn.includes(step.id) &&
        candidate.dependsOn.every(
          (dep) => dep === step.id || isStepApproved(pitchId, dep)
        )
    );
  }, [step, steps, pitchId, isStepApproved]);

  const blockingDeps = useMemo(() => {
    if (!step) return [];
    return step.dependsOn
      .filter((dep) => !isStepApproved(pitchId, dep))
      .map((dep) => getStepDef(pitchId, dep)?.label ?? dep);
  }, [step, pitchId, isStepApproved, getStepDef]);

  if (!pitch || (!isHub && !step)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm font-medium text-text-inverse">Pitch not found</p>
        <button
          type="button"
          onClick={onBackToPitchList}
          className="rounded-full border border-line px-4 py-2 text-xs font-medium text-text-inverse transition hover:bg-white/10"
        >
          Back to Pitches
        </button>
      </div>
    );
  }

  const stage = isHub
    ? PITCH_STAGES.find((item) => item.id === "work")
    : PITCH_STAGES.find((item) => item.id === step?.stageId);

  /* ---------------- track sub-step state ---------------- */
  const isTrack = step?.kind === "track";
  const subSteps = isTrack && step ? getSubSteps(pitchId, step.id) : [];
  const activeSubStep = isTrack
    ? (subSteps.find((sub) => sub.id === activeSubStepId) ?? subSteps[0] ?? null)
    : null;
  const activeSubIndex = activeSubStep
    ? subSteps.findIndex((sub) => sub.id === activeSubStep.id)
    : -1;
  const activeSubStatus =
    step && activeSubStep
      ? getSubStepStatus(pitchId, step.id, activeSubStep.id)
      : null;
  const nextSubStep =
    activeSubIndex >= 0 ? (subSteps[activeSubIndex + 1] ?? null) : null;

  const navigateAfterApprove = (approvedAfter: Set<string>) => {
    const isActionable = (candidate: PitchStepDef) =>
      !approvedAfter.has(candidate.id) &&
      candidate.dependsOn.every((dep) => approvedAfter.has(dep));

    const index = step ? steps.findIndex((item) => item.id === step.id) : -1;
    const next =
      steps.slice(index + 1).find(isActionable) ?? steps.find(isActionable);
    if (!next) return;
    // Work tracks are parallel — surface them through the hub instead of
    // dropping the user into an arbitrary track.
    if (next.kind === "track") {
      onNavigateStep(PITCH_WORK_HUB_ID);
      return;
    }
    onNavigateStep(next.id);
  };

  const handleApprove = () => {
    setApproveModalOpen(false);
    if (!step) return;

    if (isTrack && activeSubStep) {
      approveSubStep(pitchId, step.id, activeSubStep.id);
      if (nextSubStep) {
        onSubStepSelect(nextSubStep.id);
        return;
      }
      // Last sub-step — the track completes; return to the hub, which shows
      // the Decking handoff once every track is approved.
      onNavigateStep(PITCH_WORK_HUB_ID);
      return;
    }

    approveStep(pitchId, step.id);
    // Compute the next step against the optimistic approved set — the
    // provider state update hasn't flushed yet at this point.
    navigateAfterApprove(new Set([...getApprovedSteps(pitchId), step.id]));
  };

  const handleReopen = () => {
    if (!step) return;
    reopenStep(pitchId, step.id);
    setReopenModalOpen(false);
    if (isTrack && subSteps.length > 0) {
      onSubStepSelect(subSteps[0].id);
    }
  };

  const canApprove =
    status === "available" &&
    !decodeInProgress &&
    (!isTrack || activeSubStatus === "available");

  /* ---------------- stage stepper model ---------------- */
  const stageItems = PITCH_STAGES.map((stageDef) => {
    const stageSteps = steps.filter(
      (item) => item.stageId === stageDef.id
    );
    const approvedCount = stageSteps.filter(
      (item) => getStepStatus(pitchId, item.id) === "approved"
    ).length;
    const anyUnlocked = stageSteps.some(
      (item) => getStepStatus(pitchId, item.id) !== "locked"
    );

    let state: StageState;
    if (currentStageId === stageDef.id) {
      state = "active";
    } else if (stageSteps.length > 0 && approvedCount === stageSteps.length) {
      state = "approved";
    } else if (anyUnlocked) {
      state = "available";
    } else {
      state = "locked";
    }

    return {
      stage: stageDef,
      steps: stageSteps,
      approvedCount,
      state,
    };
  });

  const handleStageSelect = (stageDef: PitchStageDef) => {
    if (stageDef.id === currentStageId && !isTrack) return;
    if (stageDef.id === "work") {
      onNavigateStep(PITCH_WORK_HUB_ID);
      return;
    }
    const stageSteps = steps.filter((item) => item.stageId === stageDef.id);
    if (stageSteps.length === 0) return;
    const target =
      stageSteps.find(
        (item) => getStepStatus(pitchId, item.id) === "available"
      ) ??
      [...stageSteps]
        .reverse()
        .find((item) => getStepStatus(pitchId, item.id) === "approved") ??
      stageSteps[0];
    onNavigateStep(target.id);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* ---------------- immersive header ---------------- */}
      <header className="flex h-[72px] shrink-0 items-center justify-between gap-4 border-b border-line px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {!sidebarOpen && (
            <button
              ref={hamburgerRef}
              type="button"
              aria-label="Open navigation"
              onPointerEnter={onHamburgerEnter}
              onPointerLeave={onHamburgerLeave}
              onFocus={onHamburgerEnter}
              onBlur={onHamburgerLeave}
              className="flex size-8 shrink-0 items-center justify-center rounded-rounded text-text-inverse-subtle transition-colors hover:bg-white/[0.06] hover:text-text-inverse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <SidebarSimple size={22} />
            </button>
          )}
          <button
            type="button"
            onClick={onBackToPitchList}
            aria-label="Back to Pitches"
            className="flex size-8 shrink-0 items-center justify-center rounded-rounded text-text-inverse-subtle transition-colors hover:bg-white/[0.06] hover:text-text-inverse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <ArrowLeft size={20} />
          </button>
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-sm text-[10px] font-semibold text-white"
            style={{ backgroundColor: pitch.logoColor }}
          >
            {pitch.logoInitials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium tracking-[-0.14px] text-text-inverse">
              {pitch.brand}
            </p>
            <p className="truncate text-[10px] text-text-inverse-subtlest">
              {pitch.project}
            </p>
          </div>
        </div>

        {/* Stage stepper */}
        <nav
          aria-label="Pitch stages"
          className="flex shrink-0 items-center gap-1"
        >
          {stageItems.map((item, index) => (
            <div key={item.stage.id} className="flex items-center gap-1">
              <StageStepperItem
                index={index + 1}
                item={item}
                onSelect={() => handleStageSelect(item.stage)}
              />
              {index < stageItems.length - 1 && (
                <span className="h-px w-3 bg-line" aria-hidden />
              )}
            </div>
          ))}
        </nav>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          {/* Approve cluster */}
          {isHub || !step ? null : step.kind === "decking" ? (
            status === "locked" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-text-inverse-subtlest">
                <Lock size={13} />
                Locked
              </span>
            ) : null
          ) : status === "approved" ? (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-300">
                <SealCheck size={14} weight="fill" />
                Approved
              </span>
              <button
                type="button"
                onClick={() => setReopenModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-text-inverse-subtle transition hover:text-text-inverse"
              >
                <ArrowCounterClockwise size={13} />
                Re-open
              </button>
            </>
          ) : status === "locked" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-text-inverse-subtlest">
              <Lock size={13} />
              Locked
            </span>
          ) : isTrack && activeSubStatus === "approved" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-300">
              <SealCheck size={14} weight="fill" />
              Sub-step approved
            </span>
          ) : (
            <button
              type="button"
              disabled={!canApprove}
              onClick={() => setApproveModalOpen(true)}
              title={
                decodeInProgress
                  ? "Wait for the AI to finish decoding"
                  : undefined
              }
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCircle size={14} weight="fill" />
              Approve {isTrack ? "sub-step" : "step"}
            </button>
          )}

          <button
            type="button"
            onClick={onChatToggle}
            aria-label={chatOpen ? "Close frndOS chat" : "Open frndOS chat"}
            aria-pressed={chatOpen}
            className={`flex size-8 shrink-0 items-center justify-center rounded-rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
              chatOpen
                ? "bg-white/[0.08] text-primary-400"
                : "text-text-inverse-subtle hover:bg-white/[0.06] hover:text-text-inverse"
            }`}
          >
            <Chat size={20} weight={chatOpen ? "fill" : "regular"} />
          </button>
        </div>
      </header>

      {/* ---------------- focused step screen ---------------- */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div ref={screenRef} className="flex-1 px-8 py-8">
          <div className="mx-auto w-full max-w-5xl">
            {!isHub && step && !isTrack && step.kind !== "decking" && (
              <div className="mb-6">
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtlest">
                  {stage?.label} stage
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl font-semibold tracking-[-0.2px] text-text-inverse">
                    {step.label}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 text-[10px] font-medium text-text-inverse-subtle">
                    <span
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: PITCH_ROLE_COLOR[step.role] }}
                    />
                    {PITCH_ROLE_LABEL[step.role]}
                  </span>
                  {step.timeEstimate && (
                    <span className="font-mono text-[10px] text-text-inverse-subtlest">
                      ~{step.timeEstimate}
                    </span>
                  )}
                  {decodeInProgress && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-medium text-sky-300">
                      <Cpu size={11} className="animate-pulse" />
                      AI decoding brief…
                    </span>
                  )}
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-inverse-subtle">
                  {step.summary}
                </p>
              </div>
            )}

            {isHub ? (
              <WorkHubCanvas
                pitchId={pitchId}
                onOpenTrack={(trackStepId) => onNavigateStep(trackStepId)}
                onOpenDecking={(deckStepId) => onNavigateStep(deckStepId)}
              />
            ) : step ? (
              <StepBody
                stepStatus={status}
                step={step}
                revealCount={isDecoding ? (revealCount ?? 0) : undefined}
                blockingDeps={blockingDeps}
                pitchId={pitchId}
                activeSubStepId={activeSubStep?.id ?? null}
                onSubStepSelect={onSubStepSelect}
                onBackToHub={() => onNavigateStep(PITCH_WORK_HUB_ID)}
              />
            ) : null}
          </div>
        </div>
      </div>

      {approveModalOpen && step && (
        <ConfirmModal
          tone="default"
          icon={<CheckCircle size={20} weight="fill" className="text-emerald-300" />}
          title={
            isTrack && activeSubStep
              ? `Approve ${activeSubStep.label}?`
              : `Approve ${step.label}?`
          }
          body={isTrack && activeSubStep ? activeSubStep.summary : step.summary}
          detail={
            isTrack && activeSubStep
              ? nextSubStep
                ? `Approving unlocks the next sub-step: ${nextSubStep.label}.`
                : unlocksNext.length > 0
                  ? `This is the last sub-step — approving completes ${step.label} and unlocks: ${unlocksNext
                      .map((item) => item.label)
                      .join(" · ")}`
                  : `This is the last sub-step — approving completes ${step.label}.`
              : unlocksNext.length > 0
                ? `Approving unlocks: ${unlocksNext
                    .map((item) => item.label)
                    .join(" · ")}`
                : "This completes the final step of its stage."
          }
          confirmLabel="Approve & continue"
          onCancel={() => setApproveModalOpen(false)}
          onConfirm={handleApprove}
        />
      )}

      {reopenModalOpen && step && (
        <ConfirmModal
          tone="warning"
          icon={<Warning size={20} weight="fill" className="text-amber-300" />}
          title={`Re-open ${step.label}?`}
          body="Re-opening this step may affect downstream outputs."
          detail="Every step that depends on it will be locked again until this step is re-approved."
          confirmLabel="Re-open step"
          onCancel={() => setReopenModalOpen(false)}
          onConfirm={handleReopen}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stage stepper item                                                  */
/* ------------------------------------------------------------------ */

function StageStepperItem({
  index,
  item,
  onSelect,
}: {
  index: number;
  item: {
    stage: PitchStageDef;
    steps: PitchStepDef[];
    approvedCount: number;
    state: StageState;
  };
  onSelect: () => void;
}) {
  const { stage, steps, approvedCount, state } = item;
  const disabled = state === "locked";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      aria-current={state === "active" ? "step" : undefined}
      title={`${stage.label} · ${approvedCount}/${steps.length} approved`}
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 transition ${
        state === "active"
          ? "border-white/25 bg-white/[0.08]"
          : disabled
            ? "cursor-not-allowed border-transparent opacity-45"
            : "border-transparent hover:bg-white/[0.05]"
      }`}
    >
      {state === "approved" ? (
        <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
          <Check size={9} weight="bold" />
        </span>
      ) : disabled ? (
        <Lock size={12} className="shrink-0 text-text-inverse-subtlest" />
      ) : (
        <span
          className={`font-mono text-[10px] ${
            state === "active"
              ? "text-text-inverse"
              : "text-text-inverse-subtlest"
          }`}
        >
          {index}
        </span>
      )}
      <span
        className={`text-xs font-medium ${
          state === "active"
            ? "text-text-inverse"
            : state === "approved"
              ? "text-text-inverse-subtle"
              : "text-text-inverse-subtlest"
        }`}
      >
        {stage.label}
      </span>
      {/* intra-stage progress dots */}
      <span className="flex items-center gap-[3px]" aria-hidden>
        {steps.map((stepDef, dotIndex) => (
          <span
            key={stepDef.id}
            className={`size-1 rounded-full ${
              dotIndex < approvedCount
                ? "bg-emerald-400"
                : state === "active"
                  ? "bg-white/30"
                  : "bg-white/15"
            }`}
          />
        ))}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Step body                                                           */
/* ------------------------------------------------------------------ */

function StepBody({
  stepStatus,
  step,
  revealCount,
  blockingDeps,
  pitchId,
  activeSubStepId,
  onSubStepSelect,
  onBackToHub,
}: {
  stepStatus: "locked" | "available" | "approved";
  step: PitchStepDef;
  revealCount?: number;
  blockingDeps: string[];
  pitchId: string;
  activeSubStepId: string | null;
  onSubStepSelect: (subStepId: string) => void;
  onBackToHub: () => void;
}) {
  if (step.kind === "decking") {
    return <PitchExportCanvas pitchId={pitchId} />;
  }

  if (step.kind === "track") {
    return (
      <WorkTrackCanvas
        pitchId={pitchId}
        step={step}
        activeSubStepId={activeSubStepId}
        onSubStepSelect={onSubStepSelect}
        onBackToHub={onBackToHub}
      />
    );
  }

  if (stepStatus === "locked") {
    return <LockedStepCanvas step={step} dependencyLabels={blockingDeps} />;
  }

  switch (step.kind) {
    case "brief-decoder":
      return <BriefDecoderCanvas revealedSections={revealCount} />;
    case "pitch-plan":
      return <PitchPlanCanvas />;
    case "research-4c":
      return <Research4CCanvas />;
    case "comm-strategy":
      return <CommStrategyCanvas />;
    case "big-ideas":
      return <BigIdeasCanvas />;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Confirm modal                                                       */
/* ------------------------------------------------------------------ */

function ConfirmModal({
  tone,
  icon,
  title,
  body,
  detail,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  tone: "default" | "warning";
  icon: React.ReactNode;
  title: string;
  body: string;
  detail?: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <button
        type="button"
        aria-label="Cancel"
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-sm rounded-md border border-line bg-card-bg p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {icon}
            <h3 className="text-sm font-semibold text-text-inverse">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="rounded p-1 text-text-inverse-subtlest transition hover:bg-white/[0.06] hover:text-text-inverse"
          >
            <X size={14} />
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text-inverse-subtle">
          {body}
        </p>
        {detail && (
          <p
            className={`mt-2 rounded-sm px-3 py-2 text-xs leading-relaxed ${
              tone === "warning"
                ? "bg-amber-500/[0.08] text-amber-200"
                : "bg-white/[0.04] text-text-inverse-subtle"
            }`}
          >
            {detail}
          </p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-line px-4 py-2 text-xs font-medium text-text-inverse-subtle transition hover:text-text-inverse"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-full px-4 py-2 text-xs font-medium transition ${
              tone === "warning"
                ? "bg-amber-400 text-black hover:bg-amber-300"
                : "bg-white text-black hover:bg-white/90"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
