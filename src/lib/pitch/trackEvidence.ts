/** Evidence-strength helpers for AI track reasoning surfaces. */

export type EvidenceStrength = "high" | "medium" | "low";

export type TrackEvidenceFields = {
  evidenceStrength?: EvidenceStrength;
  evidenceSignals?: string[];
  reasoning?: string;
  sourceExcerpt?: string;
  sourcePage?: string;
};

export type ResolvedTrackEvidence = {
  strength: EvidenceStrength;
  signals: string[];
  strengthLabel: string;
  strengthDescription: string;
};

const STRENGTH_META: Record<
  EvidenceStrength,
  { label: string; description: string }
> = {
  high: {
    label: "High confidence",
    description: "Named directly in the brief",
  },
  medium: {
    label: "Medium confidence",
    description: "Strongly implied by objectives or success criteria",
  },
  low: {
    label: "Low confidence",
    description: "Inferred beyond explicit deliverables",
  },
};

function inferStrength(track: TrackEvidenceFields): EvidenceStrength {
  const page = (track.sourcePage ?? "").toLowerCase();
  const reasoning = (track.reasoning ?? "").toLowerCase();
  const excerpt = track.sourceExcerpt ?? "";

  if (
    page.includes("beyond brief") ||
    page.includes("ambitious") ||
    reasoning.includes("not named in the brief") ||
    reasoning.includes("beyond the brief") ||
    excerpt.toLowerCase().includes("inferred from")
  ) {
    return "low";
  }

  if (
    reasoning.includes("explicitly") ||
    reasoning.includes("named directly") ||
    reasoning.includes("deliverable #") ||
    reasoning.includes("is named directly") ||
    excerpt.includes("Deliverables:") ||
    excerpt.includes("Agency Deliverables:")
  ) {
    return "high";
  }

  if (excerpt.length > 20) return "medium";
  return "medium";
}

function inferSignals(
  track: TrackEvidenceFields,
  strength: EvidenceStrength
): string[] {
  if (track.evidenceSignals?.length) return track.evidenceSignals;

  const signals: string[] = [];
  const page = track.sourcePage ?? "";
  const reasoning = track.reasoning ?? "";

  if (track.sourceExcerpt) {
    signals.push("Verbatim brief excerpt cited");
  }
  if (page.includes("§A") || page.toLowerCase().includes("deliverable")) {
    signals.push("Maps to deliverables section");
  }
  if (page.includes("§D") || page.toLowerCase().includes("success")) {
    signals.push("Supported by success criteria");
  }
  if (page.includes("§B") || page.toLowerCase().includes("objective")) {
    signals.push("Aligned with stated objectives");
  }
  if (reasoning.includes("calendar") || reasoning.includes("cadence")) {
    signals.push("Different production cadence from sibling tracks");
  }
  if (strength === "low") {
    signals.push("Strategic upsell — validate with client");
  }
  if (signals.length === 0) {
    signals.push("Derived from brief objectives and deliverable mix");
  }
  return signals;
}

export function resolveTrackEvidence(
  track: TrackEvidenceFields
): ResolvedTrackEvidence {
  const strength = track.evidenceStrength ?? inferStrength(track);
  const meta = STRENGTH_META[strength];
  return {
    strength,
    signals: inferSignals(track, strength),
    strengthLabel: meta.label,
    strengthDescription: meta.description,
  };
}

export const EVIDENCE_STRENGTH_STYLES: Record<
  EvidenceStrength,
  { badge: string; bar: string; dot: string }
> = {
  high: {
    badge: "text-emerald-300 bg-emerald-500/15 border-emerald-400/25",
    bar: "bg-emerald-400",
    dot: "bg-emerald-400",
  },
  medium: {
    badge: "text-amber-300 bg-amber-500/15 border-amber-400/25",
    bar: "bg-amber-400",
    dot: "bg-amber-400",
  },
  low: {
    badge: "text-violet-300 bg-violet-500/15 border-violet-400/25",
    bar: "bg-violet-400",
    dot: "bg-violet-400",
  },
};

export const EVIDENCE_BAR_WIDTH: Record<EvidenceStrength, string> = {
  high: "w-[92%]",
  medium: "w-[62%]",
  low: "w-[34%]",
};
