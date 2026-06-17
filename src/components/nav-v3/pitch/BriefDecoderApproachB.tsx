/** Approach B — Lens Matrix comparing Safe / Balanced / Bold */

"use client";

import { useMemo, useState, type ReactNode } from "react";
import { CheckCircle, Trophy, UsersThree } from "@phosphor-icons/react";
import type { BriefOptionId, PitchBriefOption } from "@/data/pitchStatic";
import { briefFieldKey } from "@/hooks/useBriefOptions";
import { EditableAIItem } from "./EditableAIItem";
import {
  FitScoreMeter,
  LensBadge,
  fieldsDiffer,
  type BriefFocusField,
} from "./BriefDecoderShared";

type ApproachBProps = {
  pitchId: string;
  options: PitchBriefOption[];
  selectedOptionId: BriefOptionId;
  onSelectOption: (optionId: BriefOptionId) => void;
  onConfirmOption: (optionId: BriefOptionId) => void;
  onFocusField: (field: BriefFocusField) => void;
  revealedSections?: number;
};

const MATRIX_FIELDS = [
  { sectionId: "business", label: "Objective" },
  { sectionId: "business", label: "Strategy" },
  { sectionId: "product", label: "Key Message" },
  { sectionId: "pitch", label: "Success Criteria" },
];

export function BriefDecoderApproachB({
  pitchId,
  options,
  selectedOptionId,
  onSelectOption,
  onConfirmOption,
  onFocusField,
  revealedSections,
}: ApproachBProps) {
  const [confirmed, setConfirmed] = useState(false);
  const active =
    options.find((o) => o.id === selectedOptionId) ?? options[0];

  const diffFields = useMemo(() => {
    if (options.length < 2) return new Set<string>();
    const keys = new Set<string>();
    const balanced = options.find((o) => o.id === "balanced") ?? options[0];

    for (const option of options) {
      if (option.id === balanced.id) continue;
      for (const item of MATRIX_FIELDS) {
        const field = findBusinessField(option, item.sectionId, item.label);
        const base = findBusinessField(balanced, item.sectionId, item.label);
        if (field && base && fieldsDiffer(field.value, base.value)) {
          keys.add(`${option.id}:brief:${item.sectionId}:${item.label}`);
        }
      }
      option.stakeholders.forEach((person, index) => {
        const basePerson = balanced.stakeholders[index];
        if (
          basePerson &&
          fieldsDiffer(person.winningHook, basePerson.winningHook)
        ) {
          keys.add(`${option.id}:dm:${person.id}:hook`);
        }
      });
      option.winningAngles.forEach((angle, index) => {
        const baseAngle = balanced.winningAngles[index];
        if (baseAngle && fieldsDiffer(angle.angle, baseAngle.angle)) {
          keys.add(`${option.id}:win:${angle.id}:angle`);
        }
      });
    }

    return keys;
  }, [options]);

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-md border border-line bg-white/[0.02] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtlest">
              Variant B
            </p>
            <h3 className="mt-1 text-base font-semibold text-text-inverse">
              Lens Matrix
            </h3>
          </div>
          <span className="rounded-full border border-line px-2.5 py-1 text-[11px] text-text-inverse-subtle">
            Compare Safe / Balanced / Bold
          </span>
        </div>
        {revealedSections !== undefined && revealedSections < 5 && (
          <p className="mt-3 text-xs text-text-inverse-subtlest">
            The matrix fills as the Business Briefcase sections decode.
          </p>
        )}
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        {options.map((option) => {
          const isSelected = option.id === selectedOptionId;
          return (
            <section
              key={option.id}
              className={`flex min-h-[42rem] flex-col rounded-md border bg-white/[0.02] ${
                isSelected
                  ? "border-white/25 ring-1 ring-white/10"
                  : "border-line"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  onSelectOption(option.id);
                  setConfirmed(false);
                }}
                className="border-b border-line p-3 text-left transition hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between gap-2">
                  <LensBadge lens={option.lens} active={isSelected} />
                  <FitScoreMeter score={option.fitScore} />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-text-inverse-subtle">
                  {option.descriptor}
                </p>
                <p className="mt-2 text-[11px] font-medium text-text-inverse">
                  &ldquo;{option.briefEssence}&rdquo;
                </p>
              </button>

              <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3">
                <MatrixBriefcase
                  option={option}
                  pitchId={pitchId}
                  diffFields={diffFields}
                  onFocusField={onFocusField}
                />
                <MatrixDecisionMakers
                  option={option}
                  pitchId={pitchId}
                  diffFields={diffFields}
                  onFocusField={onFocusField}
                />
                <MatrixWinningStrategy
                  option={option}
                  pitchId={pitchId}
                  diffFields={diffFields}
                  onFocusField={onFocusField}
                />
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex items-center gap-3 border-t border-line pt-4">
        <button
          type="button"
          onClick={() => {
            onConfirmOption(active.id);
            setConfirmed(true);
          }}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium transition ${
            confirmed
              ? "bg-emerald-500/20 text-emerald-200"
              : "bg-white text-black hover:bg-white/90"
          }`}
        >
          <CheckCircle size={14} weight="fill" />
          {confirmed ? `Using ${active.lens} brief` : "Use selected brief"}
        </button>
        <p className="text-[11px] text-text-inverse-subtlest">
          Selected lens: {active.lens}
        </p>
      </div>
    </div>
  );
}

function MatrixBriefcase({
  option,
  pitchId,
  diffFields,
  onFocusField,
}: {
  option: PitchBriefOption;
  pitchId: string;
  diffFields: Set<string>;
  onFocusField: (field: BriefFocusField) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-200/80">
        Business Briefcase
      </p>
      <div className="flex flex-col gap-2">
        {MATRIX_FIELDS.map((item) => {
          const field = findBusinessField(option, item.sectionId, item.label);
          if (!field) return null;
          const fieldKey = briefFieldKey(
            pitchId,
            option.id,
            `brief:${item.sectionId}:${item.label}`
          );
          const diffKey = `${option.id}:brief:${item.sectionId}:${item.label}`;
          return (
            <MatrixCell
              key={fieldKey}
              label={item.label}
              diff={diffFields.has(diffKey)}
            >
              <EditableAIItem
                fieldKey={fieldKey}
                label={item.label}
                value={field.value}
                needsInfo={field.needsInfo}
                context={`Business Briefcase ${item.label}, ${option.lens} lens.`}
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
            </MatrixCell>
          );
        })}
      </div>
    </div>
  );
}

function MatrixDecisionMakers({
  option,
  pitchId,
  diffFields,
  onFocusField,
}: {
  option: PitchBriefOption;
  pitchId: string;
  diffFields: Set<string>;
  onFocusField: (field: BriefFocusField) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5">
        <UsersThree size={13} className="text-violet-300" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-200/80">
          Decision Makers
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {option.stakeholders.map((person) => {
          const fieldKey = briefFieldKey(
            pitchId,
            option.id,
            `dm:${person.id}:hook`
          );
          const diffKey = `${option.id}:dm:${person.id}:hook`;
          return (
            <MatrixCell
              key={fieldKey}
              label={person.name}
              diff={diffFields.has(diffKey)}
            >
              <EditableAIItem
                fieldKey={fieldKey}
                label={`${person.name} — winning hook`}
                value={person.winningHook}
                context={`Decision maker hook for ${person.name}, ${option.lens} lens.`}
                textClassName="text-xs leading-relaxed text-text-inverse-subtle"
                onFocusField={() =>
                  onFocusField({
                    fieldKey,
                    label: `${person.name} — winning hook`,
                    value: person.winningHook,
                    sectionRef: "Decision Makers",
                  })
                }
              />
            </MatrixCell>
          );
        })}
      </div>
    </div>
  );
}

function MatrixWinningStrategy({
  option,
  pitchId,
  diffFields,
  onFocusField,
}: {
  option: PitchBriefOption;
  pitchId: string;
  diffFields: Set<string>;
  onFocusField: (field: BriefFocusField) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5">
        <Trophy size={13} className="text-amber-300" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-200/80">
          Strategy to Win
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {option.winningAngles.slice(0, 3).map((angle, index) => {
          const fieldKey = briefFieldKey(
            pitchId,
            option.id,
            `win:${angle.id}:angle`
          );
          const diffKey = `${option.id}:win:${angle.id}:angle`;
          return (
            <MatrixCell
              key={fieldKey}
              label={`Angle ${index + 1}`}
              diff={diffFields.has(diffKey)}
            >
              <EditableAIItem
                fieldKey={fieldKey}
                label={`Winning angle ${index + 1}`}
                value={angle.angle}
                context={`Strategy to Win angle, ${option.lens} lens.`}
                textClassName="text-xs leading-relaxed text-text-inverse-subtle"
                onFocusField={() =>
                  onFocusField({
                    fieldKey,
                    label: `Winning angle ${index + 1}`,
                    value: angle.angle,
                    sectionRef: "Strategy to Win",
                  })
                }
              />
            </MatrixCell>
          );
        })}
      </div>
    </div>
  );
}

function MatrixCell({
  label,
  diff,
  children,
}: {
  label: string;
  diff: boolean;
  children: ReactNode;
}) {
  return (
    <div className="rounded-sm border border-line/60 bg-black/10 p-2">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-[10px] font-medium text-text-inverse-subtlest">
          {label}
        </p>
        {diff && (
          <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-medium text-amber-200">
            differs
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function findBusinessField(
  option: PitchBriefOption,
  sectionId: string,
  label: string
) {
  return option.businessBrief
    .find((section) => section.id === sectionId)
    ?.fields.find((field) => field.label === label);
}
