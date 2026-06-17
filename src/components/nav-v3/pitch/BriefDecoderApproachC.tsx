/** Approach C — Pitch War-room centered on decision makers and winning strategy */

"use client";

import { useState } from "react";
import {
  CheckCircle,
  Crosshair,
  Trophy,
  UsersThree,
} from "@phosphor-icons/react";
import type { BriefOptionId, PitchBriefOption } from "@/data/pitchStatic";
import { briefFieldKey } from "@/hooks/useBriefOptions";
import { EditableAIItem } from "./EditableAIItem";
import {
  FitScoreMeter,
  LensBadge,
  type BriefFocusField,
} from "./BriefDecoderShared";

type ApproachCProps = {
  pitchId: string;
  options: PitchBriefOption[];
  selectedOptionId: BriefOptionId;
  onSelectOption: (optionId: BriefOptionId) => void;
  onConfirmOption: (optionId: BriefOptionId) => void;
  onFocusField: (field: BriefFocusField) => void;
  revealedSections?: number;
};

const BRIEFCASE_SIGNALS = [
  { sectionId: "business", label: "Objective" },
  { sectionId: "business", label: "Strategy" },
  { sectionId: "product", label: "Key Message" },
  { sectionId: "pitch", label: "Success Criteria" },
];

function topDifferentiator(option: PitchBriefOption): string {
  const objective = option.businessBrief
    .find((s) => s.id === "business")
    ?.fields.find((f) => f.label === "Objective");
  return objective?.value.slice(0, 100) ?? option.descriptor;
}

export function BriefDecoderApproachC({
  pitchId,
  options,
  selectedOptionId,
  onSelectOption,
  onConfirmOption,
  onFocusField,
  revealedSections,
}: ApproachCProps) {
  const [confirmed, setConfirmed] = useState(false);
  const active =
    options.find((o) => o.id === selectedOptionId) ?? options[0];

  return (
    <div className="flex min-h-[36rem] flex-col gap-4 xl:flex-row">
      <aside className="flex shrink-0 flex-col gap-2 xl:w-[248px]">
        <div className="px-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtlest">
            Variant C
          </p>
          <h3 className="mt-1 text-base font-semibold text-text-inverse">
            Pitch War-room
          </h3>
        </div>
        {options.map((option) => {
          const isActive = option.id === selectedOptionId;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                onSelectOption(option.id);
                setConfirmed(false);
              }}
              className={`flex flex-col gap-2 rounded-md border p-3 text-left transition ${
                isActive
                  ? "border-amber-400/40 bg-amber-500/[0.08] ring-1 ring-amber-400/20"
                  : "border-line bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <LensBadge lens={option.lens} active={isActive} />
                <FitScoreMeter score={option.fitScore} />
              </div>
              <p className="text-xs font-medium leading-snug text-text-inverse">
                &ldquo;{option.briefEssence}&rdquo;
              </p>
              <p className="text-[10px] leading-relaxed text-text-inverse-subtlest line-clamp-2">
                {topDifferentiator(option)}…
              </p>
            </button>
          );
        })}
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-4 rounded-md border border-line bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.10),_transparent_48%)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <LensBadge lens={active.lens} active />
              <FitScoreMeter score={active.fitScore} />
            </div>
            <span className="rounded-full border border-line px-2.5 py-1 text-[11px] text-text-inverse-subtle">
              Decision-maker first
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-text-inverse-subtle">
            {active.descriptor}
          </p>
          {revealedSections !== undefined && revealedSections < 5 && (
            <p className="mt-2 text-xs text-text-inverse-subtlest">
              War-room signals are filling as the Business Briefcase decodes.
            </p>
          )}
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)]">
          <WarRoomDecisionMakers
            option={active}
            pitchId={pitchId}
            onFocusField={onFocusField}
          />
          <WarRoomStrategy
            option={active}
            pitchId={pitchId}
            onFocusField={onFocusField}
          />
        </div>

        <WarRoomBriefcaseSignals
          option={active}
          pitchId={pitchId}
          onFocusField={onFocusField}
        />

        <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
          <button
            type="button"
            onClick={() => {
              onConfirmOption(active.id as BriefOptionId);
              setConfirmed(true);
            }}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium transition ${
              confirmed
                ? "bg-emerald-500/20 text-emerald-200"
                : "bg-white text-black hover:bg-white/90"
            }`}
          >
            <CheckCircle size={14} weight="fill" />
            {confirmed
              ? `Using ${active.lens} brief`
              : `Use this brief (${active.lens})`}
          </button>
        </div>
      </div>
    </div>
  );
}

function WarRoomDecisionMakers({
  option,
  pitchId,
  onFocusField,
}: {
  option: PitchBriefOption;
  pitchId: string;
  onFocusField: (field: BriefFocusField) => void;
}) {
  return (
    <section className="rounded-md border border-line bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center gap-2">
        <UsersThree size={15} className="text-violet-300" />
        <h4 className="text-sm font-medium text-text-inverse">
          Decision Makers
        </h4>
      </div>
      <div className="flex flex-col gap-3">
        {option.stakeholders.map((person) => {
          const motivationKey = briefFieldKey(
            pitchId,
            option.id,
            `dm:${person.id}:motivation`
          );
          const hookKey = briefFieldKey(
            pitchId,
            option.id,
            `dm:${person.id}:hook`
          );
          return (
            <div
              key={person.id}
              className="rounded-sm border border-violet-400/20 bg-violet-500/[0.05] p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-text-inverse">
                    {person.name}
                  </p>
                  <p className="text-[11px] text-text-inverse-subtlest">
                    {person.role}
                  </p>
                </div>
                <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-violet-200">
                  {person.influence} influence
                </span>
              </div>
              <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtlest">
                What moves them
              </p>
              <EditableAIItem
                fieldKey={motivationKey}
                label={`${person.name} — motivation`}
                value={person.motivation}
                context={`Decision maker motivation for ${person.name}, ${option.lens} lens.`}
                textClassName="text-xs leading-relaxed text-text-inverse-subtle"
                onFocusField={() =>
                  onFocusField({
                    fieldKey: motivationKey,
                    label: `${person.name} — motivation`,
                    value: person.motivation,
                    sectionRef: "Decision Makers",
                  })
                }
              />
              <div className="mt-3 rounded-sm border-l-2 border-violet-300/60 bg-black/10 px-3 py-2">
                <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-violet-200/80">
                  Winning hook
                </p>
                <EditableAIItem
                  fieldKey={hookKey}
                  label={`${person.name} — winning hook`}
                  value={person.winningHook}
                  context={`Winning hook for ${person.name}, ${option.lens} lens.`}
                  textClassName="text-xs font-medium leading-relaxed text-violet-100"
                  onFocusField={() =>
                    onFocusField({
                      fieldKey: hookKey,
                      label: `${person.name} — winning hook`,
                      value: person.winningHook,
                      sectionRef: "Decision Makers",
                    })
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function WarRoomStrategy({
  option,
  pitchId,
  onFocusField,
}: {
  option: PitchBriefOption;
  pitchId: string;
  onFocusField: (field: BriefFocusField) => void;
}) {
  const stakeholderName = (id?: string) =>
    id ? option.stakeholders.find((person) => person.id === id)?.name : null;

  return (
    <section className="rounded-md border border-line bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Trophy size={15} className="text-amber-300" />
        <h4 className="text-sm font-medium text-text-inverse">
          Our Strategy to Win the Pitch
        </h4>
      </div>
      <div className="flex flex-col gap-3">
        {option.winningAngles.map((angle, index) => {
          const fieldKey = briefFieldKey(
            pitchId,
            option.id,
            `win:${angle.id}:angle`
          );
          const target = stakeholderName(angle.linkedStakeholderId);
          return (
            <div
              key={angle.id}
              className="rounded-sm border border-amber-400/25 bg-amber-500/[0.05] p-3"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-500/15 font-mono text-[10px] text-amber-200">
                  {index + 1}
                </span>
                {target && (
                  <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-medium text-violet-200">
                    wins {target}
                  </span>
                )}
              </div>
              <EditableAIItem
                fieldKey={fieldKey}
                label={`Winning angle ${index + 1}`}
                value={angle.angle}
                context={`Strategy to Win angle for ${option.lens} lens.`}
                textClassName="text-sm font-medium leading-relaxed text-text-inverse"
                onFocusField={() =>
                  onFocusField({
                    fieldKey,
                    label: `Winning angle ${index + 1}`,
                    value: angle.angle,
                    sectionRef: "Strategy to Win",
                  })
                }
              />
              <p className="mt-2 text-xs leading-relaxed text-text-inverse-subtle">
                {angle.rationale}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function WarRoomBriefcaseSignals({
  option,
  pitchId,
  onFocusField,
}: {
  option: PitchBriefOption;
  pitchId: string;
  onFocusField: (field: BriefFocusField) => void;
}) {
  return (
    <section className="mt-4 rounded-md border border-line bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Crosshair size={15} className="text-sky-300" />
        <h4 className="text-sm font-medium text-text-inverse">
          Business Briefcase Signals
        </h4>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {BRIEFCASE_SIGNALS.map((item) => {
          const field = option.businessBrief
            .find((section) => section.id === item.sectionId)
            ?.fields.find((candidate) => candidate.label === item.label);
          if (!field) return null;
          const fieldKey = briefFieldKey(
            pitchId,
            option.id,
            `brief:${item.sectionId}:${item.label}`
          );
          return (
            <div
              key={fieldKey}
              className="rounded-sm border border-line/60 bg-black/10 p-3"
            >
              <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtlest">
                {item.label}
              </p>
              <EditableAIItem
                fieldKey={fieldKey}
                label={item.label}
                value={field.value}
                needsInfo={field.needsInfo}
                context={`Business Briefcase signal ${item.label}, ${option.lens} lens.`}
                textClassName="text-xs leading-relaxed text-text-inverse-subtle"
                onFocusField={() =>
                  onFocusField({
                    fieldKey,
                    label: item.label,
                    value: field.value,
                    sectionRef: "Business Briefcase",
                  })
                }
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
