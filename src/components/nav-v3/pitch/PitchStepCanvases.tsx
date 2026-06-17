/** PROTOTYPE Pitch step canvases — Business + Foundational rich views, Work/Decking previews */

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Crosshair,
  Info,
  Lightbulb,
  Lock,
  Megaphone,
  PaintBrush,
  Sparkle,
  Star,
  TextAlignLeft,
} from "@phosphor-icons/react";
import {
  PITCH_TRACK_TYPE_LABEL,
  type PitchCaseDecode,
  type PitchStepDef,
  type PitchTrackType,
} from "@/data/pitchStatic";
import { getBriefOptions } from "@/lib/briefOptions";
import { useBriefDecoderVariant } from "@/hooks/useBriefDecoderVariant";
import { briefFieldKey, useBriefOptions } from "@/hooks/useBriefOptions";
import { VariantToggle } from "./BriefDecoderVariantToggle";
import { BriefDecoderApproachA } from "./BriefDecoderApproachA";
import { BriefDecoderApproachB } from "./BriefDecoderApproachB";
import { BriefDecoderApproachC } from "./BriefDecoderApproachC";
import type {
  BriefDecoderContext,
  BriefDecoderFocusField,
} from "./briefDecoderContext";
import {
  TrackReasoningDrawer,
  type ReasoningTrack,
} from "./TrackReasoningDrawer";

/* ------------------------------------------------------------------ */
/* Brief Decoder — multi-option shell (approaches A / B / C)           */
/* ------------------------------------------------------------------ */

export function BriefDecoderCanvas({
  pitchId,
  caseId,
  revealedSections,
  onContextChange,
}: {
  pitchId: string;
  caseId: string;
  /** number of sections revealed so far (for the decode animation); undefined = all */
  revealedSections?: number;
  onContextChange?: (context: BriefDecoderContext | null) => void;
}) {
  const { variant, setVariant } = useBriefDecoderVariant();
  const { selectedOptionId, selectOption, confirmOption } =
    useBriefOptions(pitchId);
  const [focusedField, setFocusedField] =
    useState<BriefDecoderFocusField | null>(null);
  const options = getBriefOptions(caseId);
  const active = options.find((option) => option.id === selectedOptionId) ?? options[0];

  const variantMeta = useMemo(() => {
    if (variant === "B") {
      return { label: "Lens Matrix", mode: "Matrix" as const };
    }
    if (variant === "C") {
      return { label: "Pitch War-room", mode: "War-room" as const };
    }
    return { label: "Business Briefcase", mode: "Briefcase" as const };
  }, [variant]);

  const defaultField = useMemo<BriefDecoderFocusField | null>(() => {
    if (!active) return null;
    const objective =
      active.businessBrief
        .find((section) => section.id === "business")
        ?.fields.find((field) => field.label === "Objective") ??
      active.businessBrief[0]?.fields[0];
    if (!objective) return null;
    return {
      fieldKey: briefFieldKey(
        pitchId,
        active.id,
        `brief:business:${objective.label}`
      ),
      label: objective.label,
      value: objective.value,
      sectionRef: "Business Briefcase",
    };
  }, [active, pitchId]);

  useEffect(() => {
    if (!active) return;
    onContextChange?.({
      variant,
      variantLabel: variantMeta.label,
      variantMode: variantMeta.mode,
      optionId: active.id,
      lens: active.lens,
      focusedField,
      defaultField,
    });
  }, [active, defaultField, focusedField, onContextChange, variant, variantMeta]);

  useEffect(() => {
    return () => onContextChange?.(null);
  }, [onContextChange]);

  return (
    <div className="flex flex-col gap-4 pb-24">
      <VariantToggle variant={variant} onChange={setVariant} />

      {variant === "A" && (
        <BriefDecoderApproachA
          pitchId={pitchId}
          options={options}
          selectedOptionId={selectedOptionId}
          onSelectOption={(optionId) => {
            selectOption(optionId);
            setFocusedField(null);
          }}
          onConfirmOption={confirmOption}
          onFocusField={setFocusedField}
          revealedSections={revealedSections}
        />
      )}
      {variant === "B" && (
        <BriefDecoderApproachB
          pitchId={pitchId}
          options={options}
          selectedOptionId={selectedOptionId}
          onSelectOption={(optionId) => {
            selectOption(optionId);
            setFocusedField(null);
          }}
          onConfirmOption={confirmOption}
          onFocusField={setFocusedField}
          revealedSections={revealedSections}
        />
      )}
      {variant === "C" && (
        <BriefDecoderApproachC
          pitchId={pitchId}
          options={options}
          selectedOptionId={selectedOptionId}
          onSelectOption={(optionId) => {
            selectOption(optionId);
            setFocusedField(null);
          }}
          onConfirmOption={confirmOption}
          onFocusField={setFocusedField}
          revealedSections={revealedSections}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pitch Plan — detected deliverables (clickable → reasoning drawer)   */
/* ------------------------------------------------------------------ */

export const TRACK_TYPE_ICON: Record<PitchTrackType, React.ReactNode> = {
  brand: <PaintBrush size={14} />,
  campaign: <Megaphone size={14} />,
  content: <TextAlignLeft size={14} />,
};

export const TRACK_TYPE_COLOR: Record<PitchTrackType, string> = {
  brand: "text-violet-300 bg-violet-500/15",
  campaign: "text-sky-300 bg-sky-500/15",
  content: "text-emerald-300 bg-emerald-500/15",
};

export function PitchPlanCanvas({
  decode,
  onEditPlan,
}: {
  decode: PitchCaseDecode;
  /** Optional hook to open the plan editor (scope options + edit) */
  onEditPlan?: () => void;
}) {
  const { deliverables, headline, note } = decode.pitchPlan;
  const [drawerTrack, setDrawerTrack] = useState<ReasoningTrack | null>(null);
  const byType = (type: PitchTrackType) =>
    deliverables.filter((deliverable) => deliverable.type === type);

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-md border border-line bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_40%)] p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkle size={16} className="text-sky-300" />
            <h3 className="text-sm font-medium text-text-inverse">{headline}</h3>
          </div>
          {onEditPlan && (
            <button
              type="button"
              onClick={onEditPlan}
              className="shrink-0 rounded-full border border-line px-3 py-1 text-[11px] font-medium text-text-inverse-subtle transition hover:border-white/20 hover:text-text-inverse"
            >
              Edit plan
            </button>
          )}
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-inverse-subtle">
          {note}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["brand", "campaign", "content"] as PitchTrackType[])
            .filter((type) => byType(type).length > 0)
            .map((type) => (
              <span
                key={type}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${TRACK_TYPE_COLOR[type]}`}
              >
                {TRACK_TYPE_ICON[type]}
                {byType(type).length} × {PITCH_TRACK_TYPE_LABEL[type]}
              </span>
            ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {deliverables.map((deliverable, index) => (
          <button
            key={deliverable.stepId}
            type="button"
            onClick={() => setDrawerTrack(deliverable)}
            className="flex flex-col gap-2.5 rounded-md border border-line bg-white/[0.02] p-4 text-left transition hover:border-white/20 hover:bg-white/[0.04]"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${TRACK_TYPE_COLOR[deliverable.type]}`}
              >
                {TRACK_TYPE_ICON[deliverable.type]}
                {deliverable.planLabel}
              </span>
              <span className="font-mono text-[10px] text-text-inverse-subtlest">
                T{String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-text-inverse-subtle">
              {deliverable.summary}
            </p>
            <span className="mt-auto inline-flex items-center gap-1.5 border-t border-line/50 pt-2 text-[11px] font-medium text-sky-300">
              <Info size={12} />
              Why this track? · source in brief
            </span>
          </button>
        ))}
      </div>

      <TrackReasoningDrawer
        track={drawerTrack}
        onClose={() => setDrawerTrack(null)}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Research 4C — 2×2 insight cards                                     */
/* ------------------------------------------------------------------ */

export function Research4CCanvas({ decode }: { decode: PitchCaseDecode }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {decode.research4C.map((card) => (
        <div
          key={card.id}
          className="flex flex-col gap-3 rounded-md border border-line bg-white/[0.02] p-5"
        >
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtlest">
              {card.title}
            </p>
            <h4 className="mt-1 text-sm font-medium text-text-inverse">
              {card.subtitle}
            </h4>
          </div>
          <p className="text-sm leading-relaxed text-text-inverse-subtle">
            {card.insight}
          </p>
          <div className="rounded-sm border-l-2 border-sky-400/60 bg-sky-500/[0.06] px-3 py-2">
            <p className="text-xs font-medium leading-relaxed text-sky-200">
              {card.takeaway}
            </p>
          </div>
          <p className="mt-auto text-[10px] italic text-text-inverse-subtlest">
            {card.source}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Comm Strategy — GWTB flow + proposition hero                        */
/* ------------------------------------------------------------------ */

const GWTB_ROWS = [
  { key: "get", label: "Get", hint: "the audience" },
  { key: "who", label: "Who", hint: "currently think" },
  { key: "to", label: "To", hint: "instead believe" },
  { key: "by", label: "By", hint: "convincing them" },
] as const;

export function CommStrategyCanvas({ decode }: { decode: PitchCaseDecode }) {
  const strategy = decode.commStrategy;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        {GWTB_ROWS.map((row, index) => (
          <div key={row.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-white/[0.04] text-[11px] font-semibold uppercase text-text-inverse">
                {row.label}
              </span>
              {index < GWTB_ROWS.length - 1 && (
                <span className="w-px flex-1 bg-line" />
              )}
            </div>
            <div className="mb-2 flex-1 rounded-md border border-line bg-white/[0.02] px-4 py-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtlest">
                {row.hint}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-text-inverse-subtle">
                {strategy[row.key]}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-line bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.12),_transparent_45%)] p-6 lg:p-8">
        <div className="flex items-center gap-2">
          <Crosshair size={14} className="text-amber-300" />
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtle">
            Locked proposition
          </p>
        </div>
        <p className="mt-4 text-2xl font-semibold leading-snug tracking-[-0.4px] text-text-inverse lg:text-3xl">
          {strategy.proposition}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Big Ideas — candidates with O.R.A.C.L.E. score                      */
/* ------------------------------------------------------------------ */

export function BigIdeasCanvas({ decode }: { decode: PitchCaseDecode }) {
  return (
    <div className="flex flex-col gap-3">
      {decode.bigIdeas.map((idea) => (
        <div
          key={idea.id}
          className={`rounded-md border p-5 transition ${
            idea.selected
              ? "border-amber-400/50 bg-amber-500/[0.06]"
              : "border-line bg-white/[0.02]"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Lightbulb
                size={18}
                weight={idea.selected ? "fill" : "regular"}
                className={
                  idea.selected ? "text-amber-300" : "text-text-inverse-subtle"
                }
              />
              <h4 className="text-base font-medium text-text-inverse">
                {idea.title}
              </h4>
              {idea.selected && (
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                  Locked big idea
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 font-mono text-xs text-text-inverse-subtle">
              <Star
                size={12}
                weight="fill"
                className={
                  idea.score >= 4.5 ? "text-amber-300" : "text-text-inverse-subtlest"
                }
              />
              {idea.score.toFixed(1)} / 5
            </span>
          </div>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-text-inverse-subtle">
            {idea.premise}
          </p>
        </div>
      ))}
      <p className="px-1 text-[11px] text-text-inverse-subtlest">
        Scores are O.R.A.C.L.E. averages across Originality, Relevance,
        Actionability, Cultural fit, Longevity and Executability.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Generic locked state                                                */
/* ------------------------------------------------------------------ */

export function LockedStepCanvas({
  step,
  dependencyLabels,
}: {
  step: PitchStepDef;
  dependencyLabels: string[];
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-md border border-line bg-white/[0.02] px-8 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-white/[0.05] text-text-inverse-subtle">
        <Lock size={22} />
      </span>
      <div>
        <h3 className="text-base font-medium text-text-inverse">
          {step.label} is locked
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-inverse-subtle">
          {step.summary}
        </p>
      </div>
      {dependencyLabels.length > 0 && (
        <p className="text-[11px] text-text-inverse-subtlest">
          Waiting on approval: {dependencyLabels.join(" · ")}
        </p>
      )}
    </div>
  );
}
