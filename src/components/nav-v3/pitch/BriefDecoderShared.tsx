/** Shared building blocks for Brief Decoder approaches A/B/C */

"use client";

import { useState } from "react";
import {
  CaretDown,
  Info,
  Trophy,
  UsersThree,
  WarningCircle,
} from "@phosphor-icons/react";
import type {
  BriefStakeholder,
  PitchBriefOption,
  PitchCaseDecode,
} from "@/data/pitchStatic";
import { briefFieldKey } from "@/hooks/useBriefOptions";
import { EditableAIItem } from "./EditableAIItem";
import type { BriefDecoderFocusField } from "./briefDecoderContext";

export type BriefFocusField = BriefDecoderFocusField;

export function FitScoreMeter({ score }: { score: number }) {
  const tone =
    score >= 80 ? "text-emerald-300" : score >= 65 ? "text-amber-300" : "text-rose-300";
  const barTone =
    score >= 80 ? "bg-emerald-400" : score >= 65 ? "bg-amber-400" : "bg-rose-400";

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.08]">
        <div
          className={`h-full rounded-full transition-all ${barTone}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`font-mono text-[10px] font-medium ${tone}`}>
        {score}% fit
      </span>
    </div>
  );
}

export function LensBadge({
  lens,
  active = false,
}: {
  lens: string;
  active?: boolean;
}) {
  const colors: Record<string, string> = {
    Safe: "bg-sky-500/15 text-sky-200 border-sky-400/30",
    Balanced: "bg-violet-500/15 text-violet-200 border-violet-400/30",
    Bold: "bg-amber-500/15 text-amber-200 border-amber-400/30",
  };
  const style =
    colors[lens] ?? "bg-white/[0.06] text-text-inverse-subtle border-line";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style} ${
        active ? "ring-1 ring-white/20" : ""
      }`}
    >
      {lens}
    </span>
  );
}

export function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-white/[0.02] px-4 py-3">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtlest">
        {label}
      </p>
      <p className="mt-1.5 text-sm font-medium leading-snug text-text-inverse">
        {value}
      </p>
    </div>
  );
}

type BriefBodyProps = {
  option: PitchBriefOption;
  pitchId: string;
  revealedSections?: number;
  layout?: "accordion" | "editorial";
  onFocusField?: (field: BriefFocusField) => void;
};

export function BriefOptionBody({
  option,
  pitchId,
  revealedSections,
  layout = "accordion",
  onFocusField,
}: BriefBodyProps) {
  const sections = option.businessBrief;
  const visibleCount = revealedSections ?? sections.length;
  const allRevealed = visibleCount >= sections.length;
  const [openIds, setOpenIds] = useState<string[]>([sections[0]?.id ?? ""]);

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const makeFocusHandler = (
    sectionLetter: string,
    sectionTitle: string,
    fieldLabel: string,
    fieldValue: string
  ) => {
    const fieldKey = briefFieldKey(
      pitchId,
      option.id,
      `brief:${sections.find((s) => s.title === sectionTitle)?.id ?? sectionLetter}:${fieldLabel}`
    );
    return () =>
      onFocusField?.({
        fieldKey,
        label: fieldLabel,
        value: fieldValue,
        sectionRef: `${sectionLetter}. ${sectionTitle}`,
      });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <SummaryTile
          label="Business Briefcase essence"
          value={`"${option.briefEssence}"`}
        />
        <SummaryTile label="Project type" value={option.projectType} />
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Info size={15} className="text-sky-300" />
          <h3 className="text-sm font-medium text-text-inverse">
            Business Briefcase
          </h3>
          <span className="text-[11px] text-text-inverse-subtlest">
            decoded A-E working dossier
          </span>
        </div>

      {layout === "editorial" ? (
        <div className="flex flex-col gap-6">
          {sections.map((section, index) => {
            if (index >= visibleCount) {
              return (
                <SectionSkeleton key={section.id} letter={section.letter} />
              );
            }
            return (
              <section
                key={section.id}
                className="rounded-md border border-line bg-white/[0.02] p-5"
              >
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-sm bg-white/[0.06] font-mono text-xs text-text-inverse-subtle">
                    {section.letter}
                  </span>
                  <h4 className="text-sm font-semibold text-text-inverse">
                    {section.title}
                  </h4>
                  {section.fields.some((f) => f.needsInfo) && (
                    <NeedsInfoBadge />
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  {section.fields.map((field) => (
                    <div key={field.label}>
                      <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtlest">
                        {field.label}
                      </p>
                      <EditableAIItem
                        fieldKey={briefFieldKey(
                          pitchId,
                          option.id,
                          `brief:${section.id}:${field.label}`
                        )}
                        label={field.label}
                        value={field.value}
                        needsInfo={field.needsInfo}
                        context={`Business Briefcase section ${section.letter} (${section.title}), ${option.lens} lens.`}
                        onFocusField={makeFocusHandler(
                          section.letter,
                          section.title,
                          field.label,
                          field.value
                        )}
                      />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sections.map((section, index) => {
            const revealed = index < visibleCount;
            const open = openIds.includes(section.id);

            if (!revealed) {
              return (
                <SectionSkeleton key={section.id} letter={section.letter} />
              );
            }

            return (
              <div
                key={section.id}
                className="overflow-hidden rounded-md border border-line bg-white/[0.02]"
              >
                <button
                  type="button"
                  onClick={() => toggle(section.id)}
                  aria-expanded={open}
                  className="flex h-12 w-full items-center gap-3 px-4 text-left transition hover:bg-white/[0.03]"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-white/[0.06] font-mono text-xs text-text-inverse-subtle">
                    {section.letter}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-inverse">
                    {section.title}
                  </span>
                  {section.fields.some((field) => field.needsInfo) && (
                    <NeedsInfoBadge />
                  )}
                  <CaretDown
                    size={14}
                    className={`shrink-0 text-text-inverse-subtlest transition-transform ${
                      open ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                {open && (
                  <div className="border-t border-line">
                    {section.fields.map((field) => (
                      <div
                        key={field.label}
                        className="grid grid-cols-[140px_1fr] gap-4 border-b border-line/50 px-4 py-3 last:border-b-0"
                      >
                        <span className="text-xs font-medium text-text-inverse-subtlest">
                          {field.label}
                        </span>
                        <EditableAIItem
                          fieldKey={briefFieldKey(
                            pitchId,
                            option.id,
                            `brief:${section.id}:${field.label}`
                          )}
                          label={field.label}
                          value={field.value}
                          needsInfo={field.needsInfo}
                          context={`Business Briefcase section ${section.letter} (${section.title}), ${option.lens} lens.`}
                          onFocusField={makeFocusHandler(
                            section.letter,
                            section.title,
                            field.label,
                            field.value
                          )}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      </div>

      {allRevealed && (
        <>
          <DecisionMakersBlock
            stakeholders={option.stakeholders}
            pitchId={pitchId}
            optionId={option.id}
            lens={option.lens}
            onFocusField={onFocusField}
          />
          <WinningStrategyBlock
            winningAngles={option.winningAngles}
            stakeholders={option.stakeholders}
            pitchId={pitchId}
            optionId={option.id}
            onFocusField={onFocusField}
          />
        </>
      )}
    </div>
  );
}

function SectionSkeleton({ letter }: { letter: string }) {
  return (
    <div className="flex h-12 items-center gap-3 rounded-md border border-line bg-white/[0.02] px-4">
      <span className="font-mono text-xs text-text-inverse-subtlest">
        {letter}
      </span>
      <div className="h-3 w-40 animate-pulse rounded bg-white/[0.06]" />
    </div>
  );
}

function NeedsInfoBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-300">
      <WarningCircle size={11} />
      Needs info
    </span>
  );
}

function DecisionMakersBlock({
  stakeholders,
  pitchId,
  optionId,
  lens,
  onFocusField,
}: {
  stakeholders: BriefStakeholder[];
  pitchId: string;
  optionId: PitchBriefOption["id"];
  lens: string;
  onFocusField?: (field: BriefFocusField) => void;
}) {
  if (stakeholders.length === 0) return null;
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <UsersThree size={15} className="text-violet-300" />
        <h3 className="text-sm font-medium text-text-inverse">
          Decision Makers
        </h3>
        <span className="text-[11px] text-text-inverse-subtlest">
          who signs off, and what moves them
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {stakeholders.map((person) => (
          <div
            key={person.id}
            className="flex flex-col gap-3 rounded-md border border-line bg-white/[0.02] p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full bg-violet-500/15 text-xs font-semibold text-violet-200">
                  {person.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div>
                  <p className="text-sm font-medium text-text-inverse">
                    {person.name}
                  </p>
                  <p className="text-[11px] text-text-inverse-subtlest">
                    {person.role}
                  </p>
                </div>
              </div>
              <InfluencePill level={person.influence} />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtlest">
                What drives their decision
              </p>
              <div className="mt-1">
                <EditableAIItem
                  fieldKey={briefFieldKey(
                    pitchId,
                    optionId,
                    `dm:${person.id}:motivation`
                  )}
                  label={`${person.name} — motivation`}
                  value={person.motivation}
                  context={`Decision maker ${person.name} (${person.role}), ${lens} lens.`}
                  onFocusField={() =>
                    onFocusField?.({
                      fieldKey: briefFieldKey(
                        pitchId,
                        optionId,
                        `dm:${person.id}:motivation`
                      ),
                      label: `${person.name} — motivation`,
                      value: person.motivation,
                      sectionRef: "Decision Makers",
                    })
                  }
                />
              </div>
            </div>
            <div className="rounded-sm border-l-2 border-violet-400/50 bg-violet-500/[0.06] px-3 py-2">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-violet-200/80">
                The hook that wins them
              </p>
              <div className="mt-1">
                <EditableAIItem
                  fieldKey={briefFieldKey(
                    pitchId,
                    optionId,
                    `dm:${person.id}:hook`
                  )}
                  label={`${person.name} — winning hook`}
                  value={person.winningHook}
                  textClassName="text-xs font-medium leading-relaxed text-violet-100"
                  context={`Winning hook for ${person.name} (${person.role}), ${lens} lens.`}
                  onFocusField={() =>
                    onFocusField?.({
                      fieldKey: briefFieldKey(
                        pitchId,
                        optionId,
                        `dm:${person.id}:hook`
                      ),
                      label: `${person.name} — winning hook`,
                      value: person.winningHook,
                      sectionRef: "Decision Makers",
                    })
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function InfluencePill({ level }: { level: BriefStakeholder["influence"] }) {
  const map = {
    high: "bg-rose-500/15 text-rose-200",
    medium: "bg-amber-500/15 text-amber-200",
    low: "bg-white/[0.06] text-text-inverse-subtle",
  } as const;
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide ${map[level]}`}
    >
      {level} influence
    </span>
  );
}

function WinningStrategyBlock({
  winningAngles,
  stakeholders,
  pitchId,
  optionId,
  onFocusField,
}: {
  winningAngles: PitchCaseDecode["winningAngles"];
  stakeholders: BriefStakeholder[];
  pitchId: string;
  optionId: PitchBriefOption["id"];
  onFocusField?: (field: BriefFocusField) => void;
}) {
  if (winningAngles.length === 0) return null;
  const stakeholderName = (id?: string) =>
    id ? stakeholders.find((s) => s.id === id)?.name : undefined;

  return (
    <section>
      <div className="mb-1 flex items-center gap-2">
        <Trophy size={15} className="text-amber-300" />
        <h3 className="text-sm font-medium text-text-inverse">
          Our Strategy to Win the Pitch
        </h3>
      </div>
      <p className="mb-3 text-[11px] leading-relaxed text-text-inverse-subtlest">
        How we win — emotionally and strategically. Often the winning move is
        offering something not in the brief that the decision maker loves.
      </p>
      <div className="flex flex-col gap-2.5">
        {winningAngles.map((angle, index) => {
          const target = stakeholderName(angle.linkedStakeholderId);
          return (
            <div
              key={angle.id}
              className="rounded-md border border-amber-400/25 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.08),_transparent_55%)] p-4"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-500/15 font-mono text-[10px] text-amber-200">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <EditableAIItem
                    fieldKey={briefFieldKey(
                      pitchId,
                      optionId,
                      `win:${angle.id}:angle`
                    )}
                    label={`Winning angle ${index + 1}`}
                    value={angle.angle}
                    textClassName="text-sm font-medium leading-relaxed text-text-inverse"
                    context="A 'strategy to win the pitch' angle, often beyond the brief."
                    onFocusField={() =>
                      onFocusField?.({
                        fieldKey: briefFieldKey(
                          pitchId,
                          optionId,
                          `win:${angle.id}:angle`
                        ),
                        label: `Winning angle ${index + 1}`,
                        value: angle.angle,
                        sectionRef: "Strategy to Win",
                      })
                    }
                  />
                  <div className="mt-2 flex items-start gap-1.5">
                    <Info
                      size={12}
                      className="mt-0.5 shrink-0 text-text-inverse-subtlest"
                    />
                    <p className="text-xs leading-relaxed text-text-inverse-subtle">
                      {angle.rationale}
                    </p>
                  </div>
                  {target && (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-medium text-violet-200">
                      <UsersThree size={10} />
                      Aimed at {target}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Compare two field values — returns true if materially different */
export function fieldsDiffer(a: string, b: string): boolean {
  const norm = (s: string) => s.trim().toLowerCase().slice(0, 40);
  return norm(a) !== norm(b);
}
