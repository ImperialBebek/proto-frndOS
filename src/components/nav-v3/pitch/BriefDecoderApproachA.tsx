/** Approach A — Business Briefcase dossier review */

"use client";

import { useState } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import type { BriefOptionId, PitchBriefOption } from "@/data/pitchStatic";
import {
  BriefOptionBody,
  FitScoreMeter,
  LensBadge,
  type BriefFocusField,
} from "./BriefDecoderShared";

type ApproachAProps = {
  pitchId: string;
  options: PitchBriefOption[];
  selectedOptionId: BriefOptionId;
  onSelectOption: (optionId: BriefOptionId) => void;
  onConfirmOption: (optionId: BriefOptionId) => void;
  onFocusField: (field: BriefFocusField) => void;
  revealedSections?: number;
};

export function BriefDecoderApproachA({
  pitchId,
  options,
  selectedOptionId,
  onSelectOption,
  onConfirmOption,
  onFocusField,
  revealedSections,
}: ApproachAProps) {
  const [confirmed, setConfirmed] = useState(false);

  const active =
    options.find((o) => o.id === selectedOptionId) ?? options[0];

  return (
    <div className="flex min-h-[32rem] flex-col gap-5">
      <div className="rounded-md border border-line bg-white/[0.02] p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-inverse-subtlest">
              Variant A
            </p>
            <h3 className="mt-1 text-base font-semibold text-text-inverse">
              Business Briefcase
            </h3>
          </div>
          <span className="rounded-full border border-line px-2.5 py-1 text-[11px] text-text-inverse-subtle">
            Dossier review
          </span>
        </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {options.map((option) => {
              const activeTab = option.id === selectedOptionId;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onSelectOption(option.id);
                    setConfirmed(false);
                  }}
                  className={`flex flex-col gap-2 rounded-md border p-3 text-left transition ${
                    activeTab
                      ? "border-white/25 bg-white/[0.08] ring-1 ring-white/10"
                      : "border-line bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <LensBadge lens={option.lens} active={activeTab} />
                    <FitScoreMeter score={option.fitScore} />
                  </div>
                  <p className="text-xs leading-snug text-text-inverse-subtle">
                    {option.descriptor}
                  </p>
                  <p className="truncate text-[11px] font-medium text-text-inverse">
                    &ldquo;{option.briefEssence}&rdquo;
                  </p>
                </button>
              );
            })}
          </div>
      </div>

        <BriefOptionBody
          option={active}
          pitchId={pitchId}
          revealedSections={revealedSections}
          layout="accordion"
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
          {confirmed && (
            <p className="text-[11px] text-text-inverse-subtlest">
              Selection saved — approve the step when ready.
            </p>
          )}
        </div>
    </div>
  );
}
