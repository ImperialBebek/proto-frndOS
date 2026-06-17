/** Shared evidence UI primitives for track reasoning variants. */

"use client";

import { Check, FileText, Quotes } from "@phosphor-icons/react";
import {
  EVIDENCE_BAR_WIDTH,
  EVIDENCE_STRENGTH_STYLES,
  resolveTrackEvidence,
  type TrackEvidenceFields,
} from "@/lib/pitch/trackEvidence";

export function EvidenceStrengthBadge({
  track,
  size = "sm",
}: {
  track: TrackEvidenceFields;
  size?: "sm" | "md";
}) {
  const evidence = resolveTrackEvidence(track);
  const styles = EVIDENCE_STRENGTH_STYLES[evidence.strength];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${styles.badge} ${
        size === "md" ? "px-2.5 py-1 text-[11px]" : "px-2 py-0.5 text-[10px]"
      }`}
      title={evidence.strengthDescription}
    >
      <span className={`size-1.5 shrink-0 rounded-full ${styles.dot}`} />
      {evidence.strengthLabel}
    </span>
  );
}

export function EvidenceStrengthMeter({ track }: { track: TrackEvidenceFields }) {
  const evidence = resolveTrackEvidence(track);
  const styles = EVIDENCE_STRENGTH_STYLES[evidence.strength];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-text-inverse-subtle">
          AI confidence
        </p>
        <span className="text-[11px] text-text-inverse-subtlest">
          {evidence.strengthDescription}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full transition-all ${styles.bar} ${EVIDENCE_BAR_WIDTH[evidence.strength]}`}
        />
      </div>
    </div>
  );
}

export function EvidenceChecklist({ track }: { track: TrackEvidenceFields }) {
  const evidence = resolveTrackEvidence(track);

  return (
    <ul className="flex flex-col gap-1.5">
      {evidence.signals.map((signal) => (
        <li
          key={signal}
          className="flex items-start gap-2 text-[12px] leading-snug text-text-inverse-subtle"
        >
          <Check
            size={12}
            weight="bold"
            className="mt-0.5 shrink-0 text-emerald-400/80"
          />
          {signal}
        </li>
      ))}
    </ul>
  );
}

export function BriefSourceQuote({
  excerpt,
  page,
}: {
  excerpt: string;
  page?: string;
}) {
  return (
    <div>
      <blockquote className="rounded-sm border-l-2 border-amber-400/50 bg-amber-500/[0.05] px-3 py-2 text-sm italic leading-relaxed text-amber-100">
        {excerpt}
      </blockquote>
      {page && (
        <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-text-inverse-subtlest">
          <FileText size={12} />
          {page}
        </p>
      )}
    </div>
  );
}

export function BriefSourceSection({
  track,
}: {
  track: TrackEvidenceFields & { sourceExcerpt?: string; sourcePage?: string };
}) {
  if (!track.sourceExcerpt) return null;

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Quotes size={14} className="text-amber-300" />
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-text-inverse-subtle">
          From the client brief
        </p>
      </div>
      <BriefSourceQuote excerpt={track.sourceExcerpt} page={track.sourcePage} />
    </div>
  );
}
