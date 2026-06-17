/** PROTOTYPE Pitch static data — adapted from frndOS Campaign Pitch PRD (Maleo AI Express) */

/* ------------------------------------------------------------------ */
/* Roles                                                               */
/* ------------------------------------------------------------------ */

export type PitchRole = "sc" | "ce" | "both";

export const PITCH_ROLE_COLOR: Record<PitchRole, string> = {
  sc: "#60A5FA",
  ce: "#34D399",
  both: "#FBBF24",
};

export const PITCH_ROLE_LABEL: Record<PitchRole, string> = {
  sc: "SC",
  ce: "CE",
  both: "SC + CE",
};

/* ------------------------------------------------------------------ */
/* Stages & steps (4-stage macro pipeline)                             */
/* ------------------------------------------------------------------ */

export type PitchStageId = "business" | "foundational" | "work" | "decking";

export type PitchStageDef = {
  id: PitchStageId;
  label: string;
  description: string;
  comingSoon?: boolean;
};

export const PITCH_STAGES: PitchStageDef[] = [
  {
    id: "business",
    label: "Business",
    description: "Decode the client brief into a structured Business Briefcase and pitch plan.",
  },
  {
    id: "foundational",
    label: "Foundational",
    description: "Shared research, strategy and ideation that every work track builds on.",
  },
  {
    id: "work",
    label: "Work",
    description: "Parallel deliverable tracks detected from the brief.",
  },
  {
    id: "decking",
    label: "Decking",
    description:
      "Preview the assembled presentation and export it as slides or PDF.",
  },
];

export type PitchStepKind =
  | "brief-decoder"
  | "pitch-plan"
  | "research-4c"
  | "comm-strategy"
  | "big-ideas"
  | "track"
  | "decking";

export type PitchTrackType = "brand" | "campaign" | "content";

/** How directly the brief supports an AI-detected track */
export type EvidenceStrength = "high" | "medium" | "low";

export const PITCH_TRACK_TYPE_LABEL: Record<PitchTrackType, string> = {
  brand: "Brand Platform",
  campaign: "Campaign",
  content: "Content Strategy",
};

/** Type-descriptive label for a track at the plan/setup stage — deliberately
    generic so users read it as "AI detected a track of this type", not as the
    AI having already invented the creative concept. */
export function describeTrackType(
  type: PitchTrackType,
  indexWithinType: number,
  totalOfType: number
): string {
  const base = PITCH_TRACK_TYPE_LABEL[type];
  if (type === "brand") return `${base} Track`;
  return totalOfType > 1 ? `${base} Track ${indexWithinType}` : `${base} Track`;
}

export type PitchStepDef = {
  id: string;
  stageId: PitchStageId;
  label: string;
  kind: PitchStepKind;
  role: PitchRole;
  dependsOn: readonly string[];
  timeEstimate?: string;
  trackType?: PitchTrackType;
  summary: string;
  /** Track-only: type-descriptive label for plan/setup surfaces */
  planLabel?: string;
  /** Track-only: AI reasoning + brief citation for the reasoning drawer */
  reasoning?: string;
  sourceExcerpt?: string;
  sourcePage?: string;
  evidenceStrength?: EvidenceStrength;
  evidenceSignals?: string[];
};

export const PITCH_STEPS: PitchStepDef[] = [
  {
    id: "brief-decoder",
    stageId: "business",
    label: "Brief Decoder",
    kind: "brief-decoder",
    role: "sc",
    dependsOn: [],
    summary:
      "AI reads the raw client brief and decodes it into a structured Business Briefcase (sections A–E).",
  },
  {
    id: "pitch-plan",
    stageId: "business",
    label: "Pitch Plan",
    kind: "pitch-plan",
    role: "sc",
    dependsOn: ["brief-decoder"],
    summary:
      "AI proposes the work plan: how many deliverable tracks were detected in the brief and why.",
  },
  {
    id: "research-4c",
    stageId: "foundational",
    label: "Research 4C",
    kind: "research-4c",
    role: "sc",
    dependsOn: ["pitch-plan"],
    timeEstimate: "20 min",
    summary:
      "Company, Category, Consumer and Culture insights grounding the strategy.",
  },
  {
    id: "comm-strategy",
    stageId: "foundational",
    label: "Comm Strategy",
    kind: "comm-strategy",
    role: "sc",
    dependsOn: ["research-4c"],
    timeEstimate: "20 min",
    summary:
      "GWTB framework (Get / Who / To / By) and the locked brand proposition.",
  },
  {
    id: "big-ideas",
    stageId: "foundational",
    label: "Big Ideas",
    kind: "big-ideas",
    role: "both",
    dependsOn: ["comm-strategy"],
    summary:
      "Generate, curate and lock the big idea that feeds every work track.",
  },
  {
    id: "track-brand-platform",
    stageId: "work",
    label: "FY27 Brand Platform",
    kind: "track",
    role: "both",
    trackType: "brand",
    dependsOn: ["big-ideas"],
    summary:
      "Long-term brand platform: positioning territory, key visual system, brand voice.",
  },
  {
    id: "track-campaign-launch",
    stageId: "work",
    label: "Hari Ruang Keluarga",
    kind: "track",
    role: "ce",
    trackType: "campaign",
    dependsOn: ["big-ideas"],
    summary:
      "L1 launch campaign introducing the new platform to Indonesian families.",
  },
  {
    id: "track-campaign-ramadan",
    stageId: "work",
    label: "Ramadan di Rumah",
    kind: "track",
    role: "ce",
    trackType: "campaign",
    dependsOn: ["big-ideas"],
    summary:
      "Seasonal Ramadan campaign focused on togetherness at home.",
  },
  {
    id: "track-campaign-belajar",
    stageId: "work",
    label: "Sudut Belajar",
    kind: "track",
    role: "ce",
    trackType: "campaign",
    dependsOn: ["big-ideas"],
    summary:
      "Always-on campaign around study corners for growing kids.",
  },
  {
    id: "track-content-social",
    stageId: "work",
    label: "Social Content System",
    kind: "track",
    role: "ce",
    trackType: "content",
    dependsOn: ["big-ideas"],
    summary:
      "12-month social content strategy: pillars, formats and cadence.",
  },
  {
    id: "track-content-retail",
    stageId: "work",
    label: "Retail Activation Content",
    kind: "track",
    role: "ce",
    trackType: "content",
    dependsOn: ["big-ideas"],
    summary:
      "In-store and activation content strategy connecting platform to retail.",
  },
  {
    id: "deck-builder",
    stageId: "decking",
    label: "Export Presentation",
    kind: "decking",
    role: "ce",
    dependsOn: [
      "track-brand-platform",
      "track-campaign-launch",
      "track-campaign-ramadan",
      "track-campaign-belajar",
      "track-content-social",
      "track-content-retail",
    ],
    summary:
      "Preview the deck assembled from every approved output and download it as PDF slides.",
  },
];

export const ALL_PITCH_STEP_IDS = PITCH_STEPS.map((step) => step.id);

export const WORK_TRACK_STEPS = PITCH_STEPS.filter(
  (step) => step.kind === "track"
);

export function getPitchStepDef(stepId: string): PitchStepDef | undefined {
  return PITCH_STEPS.find((step) => step.id === stepId);
}

export function getPitchStepsByStage(stageId: PitchStageId): PitchStepDef[] {
  return PITCH_STEPS.filter((step) => step.stageId === stageId);
}

export const DEFAULT_PITCH_STEP_ID = PITCH_STEPS[0].id;

/** Pseudo step id for the Work stage hub screen (not a real pipeline step) */
export const PITCH_WORK_HUB_ID = "work";

/** Representative canned track per type — used to resolve demo content for
    dynamically created tracks that have no dedicated dataset */
export const CANNED_TRACK_BY_TYPE: Record<PitchTrackType, string> = {
  brand: "track-brand-platform",
  campaign: "track-campaign-launch",
  content: "track-content-social",
};

/* ------------------------------------------------------------------ */
/* Dynamic per-pitch pipelines (built from the creation suggestion)    */
/* ------------------------------------------------------------------ */

export type NewPitchTrackInput = {
  /** Creative/working concept name — becomes the Work-stage step label */
  title: string;
  type: PitchTrackType;
  summary?: string;
  /** Type-descriptive label shown at the plan/setup stage */
  planLabel?: string;
  /** Why the AI detected this track (shown in the reasoning drawer) */
  reasoning?: string;
  /** Verbatim brief excerpt the track was derived from */
  sourceExcerpt?: string;
  /** Page / section reference for the excerpt */
  sourcePage?: string;
  /** How directly the brief supports this track */
  evidenceStrength?: EvidenceStrength;
  /** Short checklist of why the AI is confident */
  evidenceSignals?: string[];
};

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 32) || "track"
  );
}

/** Build a full per-pitch step pipeline from an edited track list */
export function buildPitchSteps(
  tracks: readonly NewPitchTrackInput[]
): PitchStepDef[] {
  const shared = PITCH_STEPS.filter(
    (step) => step.stageId === "business" || step.stageId === "foundational"
  );

  const trackSteps: PitchStepDef[] = tracks.map((track, index) => ({
    id: `track-${index + 1}-${slugify(track.title)}`,
    stageId: "work",
    label: track.title,
    kind: "track",
    role: track.type === "brand" ? "both" : "ce",
    trackType: track.type,
    dependsOn: ["big-ideas"],
    summary:
      track.summary ??
      `${PITCH_TRACK_TYPE_LABEL[track.type]} deliverable detected from the brief.`,
    planLabel: track.planLabel,
    reasoning: track.reasoning,
    sourceExcerpt: track.sourceExcerpt,
    sourcePage: track.sourcePage,
    evidenceStrength: track.evidenceStrength,
    evidenceSignals: track.evidenceSignals,
  }));

  const deckTemplate = PITCH_STEPS.find((step) => step.kind === "decking")!;
  const decking: PitchStepDef = {
    ...deckTemplate,
    dependsOn: trackSteps.map((step) => step.id),
  };

  return [...shared, ...trackSteps, decking];
}

/* ------------------------------------------------------------------ */
/* Work track sub-steps (3-step mini-pipeline per track type)          */
/* ------------------------------------------------------------------ */

export type PitchTrackSubStepDef = {
  id: string;
  label: string;
  summary: string;
};

export const TRACK_SUB_STEPS_BY_TYPE: Record<
  PitchTrackType,
  readonly PitchTrackSubStepDef[]
> = {
  brand: [
    {
      id: "positioning",
      label: "Positioning territory",
      summary:
        "The territory IKEA will own for FY27+ and the pillars that hold it up.",
    },
    {
      id: "kv-system",
      label: "Key visual system",
      summary:
        "Color, typography, photography and layout rules every track inherits.",
    },
    {
      id: "voice",
      label: "Brand voice & tone",
      summary:
        "Voice principles and example copy lines in Bahasa Indonesia first.",
    },
  ],
  campaign: [
    {
      id: "main-kv",
      label: "Main KV",
      summary:
        "Hero key visual concept: headline, tagline and art direction notes.",
    },
    {
      id: "planning",
      label: "Campaign planning",
      summary:
        "Objective, audience moment, channel mix and the phased timeline.",
    },
    {
      id: "rollout",
      label: "Rollout & channel KVs",
      summary:
        "How the main KV adapts across every channel in the mix.",
    },
  ],
  content: [
    {
      id: "pillars",
      label: "Content pillars",
      summary:
        "The recurring themes the in-house team will publish against.",
    },
    {
      id: "formats",
      label: "Format system",
      summary:
        "Repeatable formats mapped to platforms and their role in the system.",
    },
    {
      id: "cadence",
      label: "12-month cadence",
      summary:
        "Quarterly rhythm of themes and beats across the full year.",
    },
  ],
};

export function getTrackSubSteps(
  trackStepId: string
): readonly PitchTrackSubStepDef[] {
  return getTrackSubStepsForDef(getPitchStepDef(trackStepId));
}

/** Sub-steps resolved from any step def — works for dynamic per-pitch tracks */
export function getTrackSubStepsForDef(
  def: PitchStepDef | undefined
): readonly PitchTrackSubStepDef[] {
  if (!def || def.kind !== "track" || !def.trackType) return [];
  return TRACK_SUB_STEPS_BY_TYPE[def.trackType];
}

/* ------------------------------------------------------------------ */
/* Pitch list dataset (adapted from PRD sample set)                    */
/* ------------------------------------------------------------------ */

export type PitchStatus = "ongoing" | "finished" | "draft";

export type PitchListItem = {
  id: string;
  brand: string;
  project: string;
  status: PitchStatus;
  lastUpdated: string;
  deadline: string;
  daysLeft: number;
  sc: string | null;
  scColor: string | null;
  ce: string | null;
  ceColor: string | null;
  logoColor: string;
  logoInitials: string;
  pitchType?: string;
  newlyCreated?: boolean;
  /** Which decoded study case backs this pitch */
  caseId?: string;
};

export const PITCHES: PitchListItem[] = [
  {
    id: "ikea-fy27",
    brand: "IKEA",
    project: "Brand Agency Collaboration FY27",
    status: "ongoing",
    lastUpdated: "2 hours ago",
    deadline: "May 11, 2026",
    daysLeft: 3,
    sc: "EG",
    scColor: "#60A5FA",
    ce: "DA",
    ceColor: "#34D399",
    logoColor: "#0058A3",
    logoInitials: "IK",
    caseId: "ikea",
  },
  {
    id: "sunsilk-steel",
    brand: "Sunsilk",
    project: "Steel Launch — Thick & Bouncy Hair",
    status: "ongoing",
    lastUpdated: "4 hours ago",
    deadline: "May 26, 2026",
    daysLeft: 11,
    sc: "EG",
    scColor: "#60A5FA",
    ce: "AH",
    ceColor: "#F472B6",
    logoColor: "#E4007C",
    logoInitials: "SS",
    caseId: "sunsilk",
  },
  {
    id: "goodrich-onroad",
    brand: "BFGoodrich",
    project: "Awareness Project — On Road Video",
    status: "ongoing",
    lastUpdated: "Yesterday",
    deadline: "Jul 22, 2026",
    daysLeft: 37,
    sc: "JP",
    scColor: "#F59E0B",
    ce: null,
    ceColor: null,
    logoColor: "#C8102E",
    logoInitials: "BF",
    caseId: "goodrich",
  },
  {
    id: "bca-digital",
    brand: "BCA",
    project: "Digital — New Product Launch",
    status: "ongoing",
    lastUpdated: "Yesterday",
    deadline: "Jul 8, 2026",
    daysLeft: 28,
    sc: "RY",
    scColor: "#818CF8",
    ce: "AH",
    ceColor: "#F472B6",
    logoColor: "#1C4ED8",
    logoInitials: "BC",
  },
  {
    id: "telkomsel-q3",
    brand: "Telkomsel",
    project: "Q3 Brand Campaign 2026",
    status: "ongoing",
    lastUpdated: "3 days ago",
    deadline: "Jul 15, 2026",
    daysLeft: 35,
    sc: "JP",
    scColor: "#F59E0B",
    ce: null,
    ceColor: null,
    logoColor: "#DC2626",
    logoInitials: "TS",
  },
  {
    id: "grab-superapp",
    brand: "Grab",
    project: "Super App — Everyday Indonesia",
    status: "finished",
    lastUpdated: "2 weeks ago",
    deadline: "Delivered Apr 28, 2026",
    daysLeft: 0,
    sc: "EG",
    scColor: "#60A5FA",
    ce: "LK",
    ceColor: "#A78BFA",
    logoColor: "#00B14F",
    logoInitials: "GR",
  },
  {
    id: "tokopedia-ramadan",
    brand: "Tokopedia",
    project: "Ramadan Campaign — Lebaran 2026",
    status: "finished",
    lastUpdated: "1 month ago",
    deadline: "Delivered Mar 12, 2026",
    daysLeft: 0,
    sc: "RY",
    scColor: "#818CF8",
    ce: "DA",
    ceColor: "#34D399",
    logoColor: "#03AC0E",
    logoInitials: "TP",
  },
  {
    id: "unilever-pepsodent",
    brand: "Unilever",
    project: "Pepsodent — Bright Future Campaign",
    status: "draft",
    lastUpdated: "5 days ago",
    deadline: "Jul 18, 2026",
    daysLeft: 38,
    sc: null,
    scColor: null,
    ce: null,
    ceColor: null,
    logoColor: "#1F36C7",
    logoInitials: "UN",
  },
  {
    id: "gojek-anniversary",
    brand: "Gojek",
    project: "10th Anniversary Brand Campaign",
    status: "draft",
    lastUpdated: "1 week ago",
    deadline: "Aug 2, 2026",
    daysLeft: 53,
    sc: "JP",
    scColor: "#F59E0B",
    ce: null,
    ceColor: null,
    logoColor: "#00880D",
    logoInitials: "GJ",
  },
  {
    id: "samsung-s26",
    brand: "Samsung",
    project: "Galaxy S26 Launch — Indonesia",
    status: "draft",
    lastUpdated: "2 weeks ago",
    deadline: "Aug 12, 2026",
    daysLeft: 63,
    sc: null,
    scColor: null,
    ce: null,
    ceColor: null,
    logoColor: "#1428A0",
    logoInitials: "SS",
  },
];

/** Seed approval state per pitch (drives stage progress on cards + canvas) */
export const SEED_APPROVED_STEPS: Record<string, readonly string[]> = {
  "ikea-fy27": ["brief-decoder", "pitch-plan", "research-4c"],
  "sunsilk-steel": ["brief-decoder", "pitch-plan"],
  "goodrich-onroad": ["brief-decoder"],
  "bca-digital": ["brief-decoder", "pitch-plan"],
  "telkomsel-q3": ["brief-decoder"],
  "grab-superapp": ALL_PITCH_STEP_IDS,
  "tokopedia-ramadan": ALL_PITCH_STEP_IDS,
  "unilever-pepsodent": [],
  "gojek-anniversary": [],
  "samsung-s26": [],
};

/* ------------------------------------------------------------------ */
/* Canned decode dataset (IKEA FY27)                                   */
/* ------------------------------------------------------------------ */

export type BriefField = {
  label: string;
  value: string;
  needsInfo?: boolean;
};

export type BriefSection = {
  id: string;
  letter: string;
  title: string;
  fields: BriefField[];
};

/** Risk lens id for multi-option brief decoding */
export type BriefOptionId = "safe" | "balanced" | "bold";

/** A full alternative Business Briefcase interpretation (A–E + DM + Strategy) */
export type PitchBriefOption = {
  id: BriefOptionId;
  lens: string;
  descriptor: string;
  fitScore: number;
  briefEssence: string;
  projectType: string;
  businessBrief: BriefSection[];
  stakeholders: BriefStakeholder[];
  winningAngles: WinningAngle[];
};

/** Internal decision-maker (template section E) rendered as a rich card */
export type BriefStakeholder = {
  id: string;
  name: string;
  role: string;
  /** What drives their decision */
  motivation: string;
  influence: "high" | "medium" | "low";
  /** The angle that wins them over */
  winningHook: string;
};

/** A single "Our Strategy to Win the Pitch" angle (template Pitching Strategy) */
export type WinningAngle = {
  id: string;
  angle: string;
  /** Optional decision-maker this angle is aimed at */
  linkedStakeholderId?: string;
  rationale: string;
};

export type PitchDeliverable = {
  stepId: string;
  type: PitchTrackType;
  /** Creative/working concept name (used once the user works the track) */
  title: string;
  /** Type-descriptive label shown on the Pitch Plan / Review Setup */
  planLabel: string;
  summary: string;
  source: string;
  /** Why the AI suggested this track */
  reasoning: string;
  /** Verbatim brief excerpt it was derived from */
  sourceExcerpt: string;
  /** Page / section reference for the excerpt */
  sourcePage: string;
  evidenceStrength?: EvidenceStrength;
  evidenceSignals?: string[];
};

/** A pre-authored plan scope option offered at Review Setup */
export type PitchScopeOption = {
  id: "lean" | "balanced" | "ambitious";
  label: string;
  description: string;
  tracks: NewPitchTrackInput[];
};

/** Shape of a decoded brief — produced by mock static data or the real AI */
export type DecodedBrief = {
  briefEssence: string;
  projectType: string;
  businessBrief: BriefSection[];
  stakeholders: BriefStakeholder[];
  winningAngles: WinningAngle[];
  deliverables: Array<{
    type: PitchTrackType;
    planLabel: string;
    title: string;
    summary: string;
    reasoning: string;
    sourceExcerpt: string;
    sourcePage: string;
    evidenceStrength?: EvidenceStrength;
    evidenceSignals?: string[];
  }>;
};

export type ResearchCard = {
  id: string;
  title: string;
  subtitle: string;
  insight: string;
  takeaway: string;
  source: string;
};

export type GwtbStrategy = {
  get: string;
  who: string;
  to: string;
  by: string;
  proposition: string;
};

export type BigIdea = {
  id: string;
  title: string;
  premise: string;
  score: number;
  selected?: boolean;
};

/** A complete decoded brief case — one study case in the prototype */
export type PitchCaseDecode = {
  briefFileName: string;
  briefEssence: string;
  projectType: string;
  businessBrief: BriefSection[];
  stakeholders: BriefStakeholder[];
  winningAngles: WinningAngle[];
  pitchPlan: {
    headline: string;
    note: string;
    deliverables: PitchDeliverable[];
  };
  research4C: ResearchCard[];
  commStrategy: GwtbStrategy;
  bigIdeas: BigIdea[];
  /** Extra tracks the AI would add in the most ambitious scope option */
  ambitiousExtraTracks?: NewPitchTrackInput[];
};

export const IKEA_DECODE: PitchCaseDecode = {
  briefFileName: "IKEA_Creative_Brief_FY27_Updated.pdf",
  briefEssence: "Sediakan Ruang Untuk Bertumbuh",
  projectType: "Full Brand Platform + L1 Campaign",
  businessBrief: [
    {
      id: "logistics",
      letter: "A",
      title: "Logistics",
      fields: [
        {
          label: "Deliverables",
          value:
            "Brand platform, launch campaign, Ramadan & always-on campaigns, social + retail content strategy, final pitch deck.",
        },
        { label: "Budget", value: "IDR 3–5B (from client Q&A MoM)" },
        {
          label: "Timeline & Milestones",
          value:
            "Briefing Apr 10 · Internal review May 2 · Submission May 5 · Presentation May 11, 2026.",
        },
        { label: "Project Team", value: "SC: Elena G. · CE: Didit A. · PM: Jeje P." },
        { label: "Project Folder", value: "Lark Drive › Pitches › IKEA FY27" },
        { label: "Lark Task", value: "MALEO-1247 — IKEA FY27 Pitch" },
      ],
    },
    {
      id: "business",
      letter: "B",
      title: "Business",
      fields: [
        {
          label: "Background",
          value:
            "IKEA Indonesia is entering FY27 with flat store traffic and rising competition from local modern furniture players (Informa, Fabelio resellers, Vivere).",
        },
        {
          label: "Objective",
          value:
            "Reposition IKEA from 'aspirational Scandinavian showroom' to 'everyday partner for growing Indonesian families'.",
        },
        {
          label: "Business Opportunity",
          value:
            "73% of urban Indonesian families live in homes under 90m². Nobody owns the 'small space, growing family' territory yet.",
        },
        {
          label: "Strategy",
          value:
            "Client currently leans on catalogue moments and seasonal promos; wants a platform idea that compounds across the year.",
        },
      ],
    },
    {
      id: "product",
      letter: "C",
      title: "Product & Positioning",
      fields: [
        {
          label: "Brand",
          value:
            "Perceived as beautiful but distant; strong design credibility, weak emotional closeness with mainstream families.",
        },
        {
          label: "Product",
          value:
            "Full home range with hero focus on small-space solutions: modular storage, multifunctional furniture, kids' range.",
        },
        {
          label: "Target Audience",
          value:
            "Primary: urban parents 28–40, household income IDR 8–25M/mo. Secondary: newlyweds furnishing a first home.",
        },
        {
          label: "Key Message",
          value:
            "Whatever the size of your home, there is room for your family to grow.",
        },
      ],
    },
    {
      id: "pitch",
      letter: "D",
      title: "Pitch / Project",
      fields: [
        {
          label: "Mandatories",
          value:
            "IKEA logo usage rules, real product SKUs in all KVs, price-point callouts, Bahasa Indonesia first.",
        },
        {
          label: "Success Criteria",
          value:
            "Platform longevity (3+ years), campaign that lifts store visits, content engine the in-house team can run.",
        },
        {
          label: "Creative Considerations",
          value:
            "Warm, optimistic, never preachy. Reference: IKEA 'Wonderful Everyday' (UK) tonality, localized.",
        },
      ],
    },
    {
      id: "people",
      letter: "E",
      title: "People & Insights",
      fields: [
        {
          label: "Insights",
          value:
            "Parents feel guilt about small homes; reframing constraint as a canvas for growth resonates strongly in qual research.",
        },
        {
          label: "Competitors",
          value: "Informa, Vivere, Fabelio, Dekoruma, ACE Hardware (share of wallet).",
        },
        {
          label: "Competing Agencies",
          value: "Not disclosed in brief or MoM.",
          needsInfo: true,
        },
        {
          label: "Remarks",
          value:
            "Client hinted budget flexibility if the platform proves multi-year potential (MoM, Apr 12).",
        },
      ],
    },
  ] satisfies BriefSection[],

  stakeholders: [
    {
      id: "andika",
      name: "Andika Pratama",
      role: "Brand Lead",
      motivation:
        "Wants a platform idea with multi-year legs — something he can defend to regional as 'IKEA Indonesia's own thinking', not a one-off campaign.",
      influence: "high",
      winningHook:
        "Lead with the platform's 3-year roadmap and how every deliverable compounds it — make him the owner of a lasting idea.",
    },
    {
      id: "rina",
      name: "Rina Sari",
      role: "Marketing Director",
      motivation:
        "ROI-driven and skeptical of 'pretty' work. Needs retail proof — store visits and basket — to sign budget.",
      influence: "high",
      winningHook:
        "Open the campaign sections with the store-visit and transaction targets, and show the retail-activation track converting awareness to footfall.",
    },
  ] satisfies BriefStakeholder[],

  winningAngles: [
    {
      id: "growth-ruler",
      angle:
        "Bring the 'growth ruler' device into the room as a physical artefact at the pitch — let Andika and Rina mark their own kids' height on it. Not in the brief, but it makes the platform tangible in 10 seconds.",
      linkedStakeholderId: "andika",
      rationale:
        "Andika wants an ownable, lasting idea; a physical device he can point to makes the platform feel real and defensible internally.",
    },
    {
      id: "retail-proof-first",
      angle:
        "Open with a live retail-footfall model (not asked for) before any creative — show the math from awareness to store visit to basket.",
      linkedStakeholderId: "rina",
      rationale:
        "Rina signs the budget on ROI; leading with proof disarms the 'too pretty' objection before the creative even lands.",
    },
    {
      id: "inhouse-engine",
      angle:
        "Hand over a ready-to-run content engine playbook the in-house team can operate without us — generosity that signals partnership over dependency.",
      rationale:
        "The brief asks for a content engine; giving away the operating system (not just assets) differentiates us from agencies selling retainers.",
    },
  ] satisfies WinningAngle[],

  pitchPlan: {
    headline: "6 deliverable tracks detected from this brief",
    note: "Based on the deliverables list, budget shape and the client's platform ambition, frndOS detected 1 brand platform, 3 campaigns and 2 content strategies. The AI only detects how many tracks and what type — the creative concepts are yours to build. All tracks share one foundation: Research 4C → Comm Strategy → Big Ideas.",
    deliverables: [
      {
        stepId: "track-brand-platform",
        type: "brand",
        planLabel: "Brand Platform Track",
        title: "FY27 Brand Platform",
        summary:
          "The multi-year platform idea — positioning territory, visual system and brand voice that everything else plugs into.",
        source: "Brief §Objective — 'platform idea that compounds across the year'",
        reasoning:
          "The brief explicitly asks to reposition IKEA and wants 'a platform idea that compounds across the year' with '3+ year longevity'. That signals a foundational brand-platform deliverable, not a single campaign — so the AI detected exactly one brand track that the campaign and content tracks all inherit from.",
        sourceExcerpt:
          "\"Reposition IKEA … wants a platform idea that compounds across the year.\" / Success: \"Platform longevity (3+ years).\"",
        sourcePage: "Brief §B Objective + §D Success Criteria",
      },
      {
        stepId: "track-campaign-launch",
        type: "campaign",
        planLabel: "Campaign Track 1 — Launch Moment",
        title: "Hari Ruang Keluarga (Launch)",
        summary:
          "L1 launch campaign introducing the platform to Indonesian families with a national moment.",
        source: "Brief §Deliverables — 'launch campaign'",
        reasoning:
          "'Launch campaign' is named directly in the deliverables list, and the objective calls for lifting store visits — a high-impact L1 moment. The AI flagged this as a distinct campaign track because launch and seasonal work run on different calendars and budgets.",
        sourceExcerpt:
          "Deliverables: \"…launch campaign…\" · Success: \"campaign that lifts store visits.\"",
        sourcePage: "Brief §A Deliverables",
      },
      {
        stepId: "track-campaign-ramadan",
        type: "campaign",
        planLabel: "Campaign Track 2 — Seasonal Moment",
        title: "Ramadan di Rumah (Seasonal)",
        summary:
          "Seasonal Ramadan campaign on togetherness at home — IKEA's biggest retail window.",
        source: "Brief §Deliverables — 'Ramadan campaign'",
        reasoning:
          "The deliverables list a Ramadan campaign separately from the launch. Because it's calendar-locked to IKEA's biggest retail window, the AI kept it as its own campaign track rather than folding it into the launch.",
        sourceExcerpt: "Deliverables: \"…Ramadan & always-on campaigns…\"",
        sourcePage: "Brief §A Deliverables",
      },
      {
        stepId: "track-campaign-belajar",
        type: "campaign",
        planLabel: "Campaign Track 3 — Always-On",
        title: "Sudut Belajar (Always-on)",
        summary:
          "Always-on campaign around study corners for growing kids, sustaining the platform between peaks.",
        source: "Brief §Deliverables — 'always-on campaign'",
        reasoning:
          "An 'always-on' campaign is listed alongside the seasonal one. Always-on work has a different cadence (continuous vs burst), so the AI detected a third campaign track to sustain the platform between peaks.",
        sourceExcerpt: "Deliverables: \"…Ramadan & always-on campaigns…\"",
        sourcePage: "Brief §A Deliverables",
      },
      {
        stepId: "track-content-social",
        type: "content",
        planLabel: "Content Track 1 — Social Engine",
        title: "Social Content System",
        summary:
          "12-month social strategy: pillars, formats and cadence the in-house team can run.",
        source: "Brief §Success Criteria — 'content engine the in-house team can run'",
        reasoning:
          "Success criteria call for 'a content engine the in-house team can run'. That's a content-strategy deliverable (pillars/formats/cadence), distinct from campaigns — the AI detected a dedicated social content track.",
        sourceExcerpt:
          "Success: \"content engine the in-house team can run.\"",
        sourcePage: "Brief §D Success Criteria",
      },
      {
        stepId: "track-content-retail",
        type: "content",
        planLabel: "Content Track 2 — Retail Activation",
        title: "Retail Activation Content",
        summary:
          "In-store and activation content connecting the platform to store visits.",
        source: "Brief §Success Criteria — 'campaign that lifts store visits'",
        reasoning:
          "Retail proof is a recurring demand (Rina Sari, store-visit lift). In-store/activation content runs on a different surface than social, so the AI split it into a second content track focused on converting the platform into footfall.",
        sourceExcerpt:
          "Success: \"campaign that lifts store visits.\" · Decision maker: Rina Sari wants retail proof.",
        sourcePage: "Brief §D + §E",
      },
    ] satisfies PitchDeliverable[],
  },

  research4C: [
    {
      id: "company",
      title: "Company",
      subtitle: "IKEA Indonesia",
      insight:
        "IKEA's design credibility is unmatched, but 68% of non-customers say it 'feels like a brand for other people's homes'.",
      takeaway:
        "The platform must close the distance — IKEA for your real home, not the showroom dream.",
      source: "Brand health tracker Q1 2026 · 2,400 respondents",
    },
    {
      id: "category",
      title: "Category",
      subtitle: "Furniture & home living",
      insight:
        "Local players win on price and proximity, but none own an emotional territory. Category comms are 90% product-and-promo.",
      takeaway:
        "An emotional platform is white space — first mover owns 'family growth' for years.",
      source: "Category comms audit · Apify social scrape Mar 2026",
    },
    {
      id: "consumer",
      title: "Consumer",
      subtitle: "Urban parents 28–40",
      insight:
        "73% live in homes under 90m². Parents describe their home with guilt words — 'sempit', 'belum ideal' — yet 81% say family moments matter more than size.",
      takeaway:
        "Reframe the small home: not a limitation, but the space where growth happens.",
      source: "Qual research · 12 IDIs + social listening, Apr 2026",
    },
    {
      id: "culture",
      title: "Culture",
      subtitle: "Indonesian family life",
      insight:
        "'Tumbuh' (growth) is a loaded cultural word — used for kids, careers, faith and family. Content about making-do-beautifully ('hidup rapi di rumah kecil') is up 4× YoY on TikTok.",
      takeaway:
        "Anchor the platform in 'tumbuh' — culturally rich, ownable, and already trending bottom-up.",
      source: "TikTok/IG trend scrape · 90-day window",
    },
  ] satisfies ResearchCard[],

  commStrategy: {
    get: "Urban Indonesian parents (28–40) in sub-90m² homes who feel their house is 'not ideal yet'",
    who: "see IKEA as a distant showroom brand for other people's homes",
    to: "believe IKEA is the everyday partner that makes their small home the best place for their family to grow",
    by: "proving that every corner — however small — can be designed for growth, with real solutions at real prices",
    proposition: "Sediakan Ruang Untuk Bertumbuh — Make room to grow.",
  } satisfies GwtbStrategy,

  bigIdeas: [
    {
      id: "ruang-tumbuh",
      title: "Ruang Tumbuh",
      premise:
        "Every small home holds infinite room to grow. IKEA turns each corner into a stage for the family's next chapter — first steps, first study desk, first sahur together.",
      score: 4.6,
      selected: true,
    },
    {
      id: "rumah-jadi",
      title: "Rumah Jadi Cerita",
      premise:
        "Homes aren't finished, they're written. IKEA furniture as chapters in the family story.",
      score: 4.1,
    },
    {
      id: "kecil-besar",
      title: "Kecil-kecil, Besar Artinya",
      premise:
        "Small spaces, big meaning. Celebrating the outsized moments that happen in compact homes.",
      score: 3.8,
    },
  ] satisfies BigIdea[],

  ambitiousExtraTracks: [
    {
      title: "Commerce Activation Track",
      type: "content",
      planLabel: "Content Track 3 — Commerce",
      summary:
        "Marketplace storefront + bundle strategy converting the platform directly to basket — beyond the brief, but it's where Rina Sari's ROI lives.",
      reasoning:
        "Not named in the brief, but the ROI/store-visit pressure points to a commerce surface. Added only in the Ambitious scope as an upsell track.",
      sourceExcerpt: "Inferred from §E Decision Makers (Rina Sari — ROI-driven).",
      sourcePage: "Beyond brief — Ambitious scope",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Canned work-track outputs (per track × sub-step)                    */
/* ------------------------------------------------------------------ */

export type TrackContentBlock =
  | {
      kind: "kv-concept";
      title: string;
      headline: string;
      tagline: string;
      visual: string;
      artDirection: readonly string[];
    }
  | {
      kind: "campaign-plan";
      objective: string;
      audienceMoment: string;
      channelMix: readonly string[];
      phases: readonly { phase: string; window: string; focus: string }[];
    }
  | {
      kind: "channel-rollout";
      adaptations: readonly {
        channel: string;
        format: string;
        note: string;
      }[];
    }
  | {
      kind: "positioning";
      territory: string;
      pillars: readonly { name: string; description: string }[];
    }
  | {
      kind: "visual-system";
      elements: readonly { element: string; direction: string }[];
    }
  | {
      kind: "voice";
      principles: readonly { name: string; description: string }[];
      exampleLines: readonly string[];
    }
  | {
      kind: "content-pillars";
      pillars: readonly {
        name: string;
        description: string;
        examplePost: string;
      }[];
    }
  | {
      kind: "format-system";
      formats: readonly { name: string; platform: string; role: string }[];
    }
  | {
      kind: "cadence";
      entries: readonly {
        period: string;
        theme: string;
        beats: readonly string[];
      }[];
    };

export type PitchTrackSubStepOutput = {
  heading: string;
  intro: string;
  blocks: readonly TrackContentBlock[];
};

/** Canned IKEA FY27 demo content for every (work track × sub-step) pair */
export const TRACK_OUTPUTS: Record<
  string,
  Record<string, PitchTrackSubStepOutput>
> = {
  "track-brand-platform": {
    positioning: {
      heading: "The territory IKEA can own",
      intro:
        "Built from the locked GWTB strategy and the 'Ruang Tumbuh' big idea — a multi-year territory no competitor currently claims.",
      blocks: [
        {
          kind: "positioning",
          territory:
            "IKEA is the everyday partner for growing Indonesian families. While competitors sell furniture for the home you wish you had, IKEA designs for the home you actually live in — turning every sub-90m² house from a source of guilt into the canvas where the family's next chapter happens. We don't promise more space. We make room to grow.",
          pillars: [
            {
              name: "Tumbuh Itu Nyata",
              description:
                "Growth shows up in real, small moments — a first study desk, a crib that becomes a reading corner, one more chair at the sahur table. The platform celebrates these milestones, not square meters.",
            },
            {
              name: "Setiap Sudut Berarti",
              description:
                "Every corner counts. IKEA's modular, multifunctional range proves that a 2×2m corner can carry as much meaning as a full room — the product story behind the emotional story.",
            },
            {
              name: "Harga yang Masuk Akal",
              description:
                "Real solutions at real prices. Every expression of the platform carries a concrete SKU and price point, keeping the aspirational idea grounded in attainability (brief mandatory).",
            },
          ],
        },
      ],
    },
    "kv-system": {
      heading: "Ruang Tumbuh visual system",
      intro:
        "A key visual system flexible enough to flex across 3 campaigns and 2 content engines while staying unmistakably IKEA.",
      blocks: [
        {
          kind: "visual-system",
          elements: [
            {
              element: "Color",
              direction:
                "IKEA Blue and Yellow stay as the brand anchor; the platform adds a warm 'tumbuh' accent palette — terracotta, warm sand, leaf green — drawn from Indonesian home interiors. Accents never exceed 30% of any layout.",
            },
            {
              element: "Typography",
              direction:
                "Noto IKEA Sans, Bahasa Indonesia first. Headlines set extra-bold with generous tracking; the word 'tumbuh' may scale up within a headline as the single typographic flourish — never more than one per layout.",
            },
            {
              element: "Photography",
              direction:
                "Real Indonesian homes under 90m², natural morning light, families mid-activity. Shoot wide to celebrate the whole room in honest clutter — never showroom symmetry. Real SKUs visible and price-tagged in frame.",
            },
            {
              element: "Layout grid",
              direction:
                "The 'growth ruler' device: a vertical measuring strip on the left edge of every KV, marking family milestones the way parents mark height on a doorframe. Doubles as the system's grid anchor and campaign-to-campaign connective tissue.",
            },
          ],
        },
      ],
    },
    voice: {
      heading: "How Ruang Tumbuh speaks",
      intro:
        "Warm, optimistic, never preachy — the localized 'Wonderful Everyday' tonality the brief asked for, codified into rules the in-house team can apply.",
      blocks: [
        {
          kind: "voice",
          principles: [
            {
              name: "Hangat, bukan menggurui",
              description:
                "Speak like a helpful neighbor, not a lifestyle guru. We never tell families their home is wrong — we notice what's already growing in it.",
            },
            {
              name: "Bahasa rumah",
              description:
                "Bahasa Indonesia first, everyday words over marketing words. 'Sudut', 'rapi', 'cukup', 'tumbuh' — vocabulary pulled from how parents actually describe their homes in our qual research.",
            },
            {
              name: "Optimis terhadap yang kecil",
              description:
                "Small is never a limitation in our copy. Every line reframes constraint as possibility, and lands on a concrete, attainable next step — usually with a price.",
            },
          ],
          exampleLines: [
            "Rumah 36m². Mimpinya? Tidak ada batasnya.",
            "Sudut kosong hari ini, meja belajar pertama besok.",
            "Tidak perlu pindah rumah untuk bertumbuh. Mulai dari Rp 299.900.",
          ],
        },
      ],
    },
  },

  "track-campaign-launch": {
    "main-kv": {
      heading: "Hari Ruang Keluarga — hero KV",
      intro:
        "The national launch moment that introduces Ruang Tumbuh to Indonesian families — one day a year to rearrange the living room around what the family needs next.",
      blocks: [
        {
          kind: "kv-concept",
          title: "Hari Ruang Keluarga",
          headline: "Hari Ini, Ruang Keluarga Kita Ikut Bertumbuh.",
          tagline: "Sediakan Ruang Untuk Bertumbuh.",
          visual:
            "A young family mid-rearrange in a compact living room: dad sliding a KALLAX unit aside, mom unrolling a play mat, toddler taking first steps into the newly opened floor space. The growth ruler frames the left edge, marking 'langkah pertama' at toddler height.",
          artDirection: [
            "Morning light, lived-in warmth — boxes half-unpacked, real clutter at the frame edges.",
            "Hero SKUs visible with price callouts: KALLAX (Rp 999.000), BESTÅ wall unit, RÅSKOG cart (brief mandatory).",
            "Master in 16:9 and 4:5; growth ruler device must survive every crop.",
          ],
        },
      ],
    },
    planning: {
      heading: "Launch campaign plan",
      intro:
        "An 8-week L1 plan that converts the platform launch into store visits — the proof point Rina Sari (Marketing Director) needs.",
      blocks: [
        {
          kind: "campaign-plan",
          objective:
            "Introduce the Ruang Tumbuh platform with a national moment — Hari Ruang Keluarga — lifting aided awareness of the new positioning to 40% among urban parents and driving a 15% lift in store visits during launch month.",
          audienceMoment:
            "Urban parents 28–40 hit the new-year 'beres-beres rumah' reset — the natural window when families rearrange the home around a growing child's next phase.",
          channelMix: [
            "60s anthem film on YouTube + 15s/6s cutdowns",
            "National OOH domination in 6 cities (Jabodetabek, Bandung, Surabaya, Medan, Makassar, Semarang)",
            "#HariRuangKeluarga TikTok & Instagram challenge with 10 macro + 40 micro family creators",
            "In-store Hari Ruang Keluarga room-set takeover with price-point displays",
            "CRM + WhatsApp blast to IKEA Family members with rearrange-your-ruang starter bundles",
          ],
          phases: [
            {
              phase: "Tease",
              window: "Week 1–2",
              focus:
                "Provocation OOH and social: 'Sempit?' crossed out, replaced with 'Siap Tumbuh.' No brand reveal until week 2.",
            },
            {
              phase: "Launch",
              window: "Week 3",
              focus:
                "Anthem film drops, OOH flips to the hero KV, Hari Ruang Keluarga declared with a one-day in-store national event.",
            },
            {
              phase: "Sustain",
              window: "Week 4–8",
              focus:
                "Creator transformation content, retail bundles and CRM journeys keep the moment converting into visits.",
            },
          ],
        },
      ],
    },
    rollout: {
      heading: "Channel rollout — Hari Ruang Keluarga",
      intro:
        "How the hero KV adapts across the launch mix without losing the growth ruler or the price-point mandatory.",
      blocks: [
        {
          kind: "channel-rollout",
          adaptations: [
            {
              channel: "OOH (6 cities)",
              format: "Billboard & transit 6×12m / station domination",
              note: "Anthem KV crop with oversized headline; single hero SKU + price in the bottom-right price tag device.",
            },
            {
              channel: "TikTok",
              format: "9:16 creator-led, 15–34s",
              note: "Real families do a one-day ruang keluarga rearrange; hero KV end-frame with #HariRuangKeluarga sticker.",
            },
            {
              channel: "Instagram",
              format: "4:5 carousel + Reels",
              note: "Before/after corner transformations, each slide tagged with the SKU and price that made it happen.",
            },
            {
              channel: "YouTube",
              format: "16:9 anthem 60s + masthead",
              note: "Full anthem film on launch day masthead; cutdowns retarget viewers with the nearest-store CTA.",
            },
            {
              channel: "In-store",
              format: "Room-set entrance arch + standees",
              note: "Growth ruler standee at the entrance lets kids measure themselves; room sets restage the KV at real scale.",
            },
          ],
        },
      ],
    },
  },

  "track-campaign-ramadan": {
    "main-kv": {
      heading: "Ramadan di Rumah — hero KV",
      intro:
        "IKEA's biggest retail window, reframed through Ruang Tumbuh: the same small home, holding the most meaningful month of the year.",
      blocks: [
        {
          kind: "kv-concept",
          title: "Ramadan di Rumah",
          headline: "Ruang yang Sama, Ramadan yang Lebih Bermakna.",
          tagline: "Sediakan Ruang Untuk Berkumpul — dan Bertumbuh.",
          visual:
            "Pre-dawn sahur scene: three generations around an extended NORDEN gateleg table in a compact dining space, warm lamp glow against the blue hour outside the window. The growth ruler marks 'sahur pertama Kak Alya ikut puasa penuh'.",
          artDirection: [
            "Low warm tungsten light against cool pre-dawn blue — the emotional signature of the campaign.",
            "Extendable and storage SKUs as heroes: NORDEN table, STRANDMON chair, BESTÅ sideboard, all price-tagged.",
            "Tone is intimate and respectful — togetherness over consumption; no promotional bursts in the hero layer.",
          ],
        },
      ],
    },
    planning: {
      heading: "Ramadan campaign plan",
      intro:
        "A calendar-locked seasonal plan that owns the hosting moment — when families prepare the home for iftar guests and Lebaran relatives.",
      blocks: [
        {
          kind: "campaign-plan",
          objective:
            "Own IKEA's biggest retail window by making IKEA the partner for hosting Ramadan at home — driving basket size on dining, storage and textiles, and a 20% lift in transactions across the Ramadan–Lebaran period.",
          audienceMoment:
            "Two weeks before Ramadan, families audit the home: where will we do sahur together, where do guests sit at iftar, is the house ready for relatives at Lebaran?",
          channelMix: [
            "45s online film 'Sahur Pertama' + sahur-slot digital spots (03.00–05.00 WIB)",
            "Geo-targeted OOH on mudik routes and around traditional markets",
            "TikTok sahur-countdown creator series + IG iftar table styling Reels",
            "E-commerce 'Siap Ramadan' bundles (dining, storage, prayer corner) on marketplace storefronts",
            "In-store Pasar Ramadan section with hosting room sets and price-point displays",
          ],
          phases: [
            {
              phase: "Persiapan",
              window: "2 weeks pre-Ramadan",
              focus:
                "Home-prep content and bundles: making room for the sahur table, guest seating, the prayer corner.",
            },
            {
              phase: "Ramadan",
              window: "Week 1–3",
              focus:
                "Sahur-slot media and daily togetherness content; iftar hosting solutions take the retail front.",
            },
            {
              phase: "Lebaran",
              window: "Week 4 + Lebaran week",
              focus:
                "Hosting-relatives peak: extendable dining, extra sleeping solutions, 'rumah siap menyambut' messaging.",
            },
          ],
        },
      ],
    },
    rollout: {
      heading: "Channel rollout — Ramadan di Rumah",
      intro:
        "Adaptations tuned to Ramadan rhythms — media weight follows the day's emotional peaks: sahur, iftar, and the road home.",
      blocks: [
        {
          kind: "channel-rollout",
          adaptations: [
            {
              channel: "Online film",
              format: "16:9 45s + 15s cutdowns",
              note: "'Sahur Pertama' film; cutdowns run in sahur and pre-iftar slots only — never midday.",
            },
            {
              channel: "TikTok",
              format: "9:16 series, daily during Ramadan",
              note: "Creator sahur-countdown: 30 days, 30 small dining/storage fixes, hero KV frame closing each episode.",
            },
            {
              channel: "Instagram",
              format: "Reels + saveable carousels",
              note: "Iftar table styling under Rp 1.5jt; carousels designed to be saved and shopped before the weekend.",
            },
            {
              channel: "OOH mudik routes",
              format: "Billboard on toll & rest areas",
              note: "'Rumah Siap Menyambut' message for the journey home; nearest-store wayfinding on rest-area placements.",
            },
            {
              channel: "In-store",
              format: "Pasar Ramadan zone",
              note: "Hosting room sets restage the KV; bundle pricing on dining and guest-sleeping solutions.",
            },
          ],
        },
      ],
    },
  },

  "track-campaign-belajar": {
    "main-kv": {
      heading: "Sudut Belajar — hero KV",
      intro:
        "The always-on expression of Ruang Tumbuh: one corner of the home, dedicated to a child's next chapter.",
      blocks: [
        {
          kind: "kv-concept",
          title: "Sudut Belajar",
          headline: "Satu Sudut, Sejuta Cita-cita.",
          tagline: "Sediakan Ruang Untuk Bertumbuh.",
          visual:
            "The corner of a shared bedroom transformed into a study nook: FLISAT desk, SKÅDIS pegboard wall, warm task lamp. A kid does homework while a younger sibling plays at their feet — proof the corner serves the whole family. The growth ruler marks 'kelas 1 SD' rising to 'kelas 6'.",
          artDirection: [
            "After-school golden hour light; the corner glows as the brightest point of the room.",
            "Hero SKUs price-tagged: FLISAT desk (Rp 1.299.000), SKÅDIS board, TERTIAL lamp — full corner under Rp 2jt.",
            "Crop system must work as a tall 9:16 'corner reveal' for social-first placements.",
          ],
        },
      ],
    },
    planning: {
      heading: "Always-on campaign plan",
      intro:
        "A 12-month rhythm that sustains the platform between campaign peaks, synced to the Indonesian school calendar.",
      blocks: [
        {
          kind: "campaign-plan",
          objective:
            "Keep Ruang Tumbuh present between campaign peaks by owning the study-corner moment — building consistent consideration among parents of school-age kids and a steady commerce line on the kids' range.",
          audienceMoment:
            "Parents of school-age kids carry quiet guilt about not having a proper study space — the moment spikes at semester starts, report cards and exam season.",
          channelMix: [
            "Always-on search + social (TikTok, IG, YouTube Shorts) with monthly makeover drops",
            "Back-to-school media bursts in July and January semester starts",
            "Parenting community partnerships (sekolah.mu, parenting KOLs, school WhatsApp seeding kits)",
            "Marketplace 'Sudut Belajar' curated storefront with bundle landing page",
            "In-store kids' study corner displays refreshed each semester",
          ],
          phases: [
            {
              phase: "Semester burst 1",
              window: "Jul–Aug",
              focus:
                "Back-to-school peak: corner makeover content and bundles for the new school year.",
            },
            {
              phase: "Steady state",
              window: "Sep–Des",
              focus:
                "Monthly makeover drops, report-card moment content, community seeding.",
            },
            {
              phase: "Semester burst 2",
              window: "Jan–Feb",
              focus:
                "New-semester reset synced with the Hari Ruang Keluarga launch energy.",
            },
            {
              phase: "Exam season",
              window: "Apr–Mei",
              focus:
                "Focus-friendly corner content: lighting, organization and quiet-zone solutions for exam prep.",
            },
          ],
        },
      ],
    },
    rollout: {
      heading: "Channel rollout — Sudut Belajar",
      intro:
        "Lightweight, repeatable adaptations the in-house team can keep producing all year without agency dependency.",
      blocks: [
        {
          kind: "channel-rollout",
          adaptations: [
            {
              channel: "TikTok",
              format: "9:16 makeover series, monthly",
              note: "'Sudut Belajar Minggu Ini' — one real family's corner transformed in 60 seconds, budget on screen.",
            },
            {
              channel: "Instagram",
              format: "Saveable 4:5 carousels",
              note: "'Sudut belajar di bawah Rp 2jt' shopping-list carousels; every slide is a SKU + price.",
            },
            {
              channel: "YouTube Shorts",
              format: "9:16 cutdowns",
              note: "Re-edit of TikTok makeovers with search-friendly titles ('meja belajar anak SD').",
            },
            {
              channel: "Marketplace",
              format: "Curated storefront + bundles",
              note: "Sudut Belajar collection page mirrors the monthly social drop; bundle pricing matches carousel claims.",
            },
            {
              channel: "In-store",
              format: "Kids' department corner display",
              note: "A real 2×2m study corner restaged each semester; growth ruler invites kids to measure in.",
            },
          ],
        },
      ],
    },
  },

  "track-content-social": {
    pillars: {
      heading: "Social content pillars",
      intro:
        "Four recurring themes that translate Ruang Tumbuh into a daily social presence the in-house team can run — the 'content engine' the brief demands.",
      blocks: [
        {
          kind: "content-pillars",
          pillars: [
            {
              name: "Ruang Cerita",
              description:
                "Real family growth stories from real sub-90m² homes — the emotional heart of the engine, sourced from UGC and community submissions.",
              examplePost:
                "60s home tour: 'Pojok 2×2 meter ini tempat anakku belajar jalan, belajar baca, dan sekarang belajar ngaji.'",
            },
            {
              name: "Trik Tumbuh",
              description:
                "Small-space hacks built on IKEA SKUs — practical proof that every corner can grow with the family.",
              examplePost:
                "Carousel: '5 cara KALLAX tumbuh bersama anak — dari kotak mainan ke rak buku sekolah ke meja TV remaja.'",
            },
            {
              name: "Sudut demi Sudut",
              description:
                "Serialized corner makeovers — one corner, one budget, one weekend. The engine's most shoppable pillar.",
              examplePost:
                "Reel: 'Episode 12 — sudut cucian jadi sudut baca. Total belanja: Rp 1.450.000.'",
            },
            {
              name: "Tanya IKEA",
              description:
                "Community-driven Q&A and co-creation: followers submit their stubborn corner, IKEA answers with a plan.",
              examplePost:
                "Story poll → response Reel: 'Sudut buntu di bawah tangga? Ini 3 solusi mulai Rp 499.000.'",
            },
          ],
        },
      ],
    },
    formats: {
      heading: "Format system",
      intro:
        "Repeatable, named formats so the in-house team produces to a system, not from scratch — each mapped to a platform and a job.",
      blocks: [
        {
          kind: "format-system",
          formats: [
            {
              name: "Ruang Tumbuh Diaries",
              platform: "TikTok 9:16 · weekly",
              role: "Hero storytelling — one family's real growth story per week, anchors the Ruang Cerita pillar.",
            },
            {
              name: "Makeover Menit",
              platform: "Instagram Reels · biweekly",
              role: "Fast corner transformation with budget on screen; the engine's top reach + save driver.",
            },
            {
              name: "Hitung Ruang",
              platform: "IG carousel · weekly",
              role: "Product education: measured plans, SKUs and prices for one corner type. Built to be saved and shopped.",
            },
            {
              name: "Live Tur Rumah",
              platform: "TikTok / IG Live · monthly",
              role: "Live home tour with a designer answering questions — community trust and retention play.",
            },
            {
              name: "Tanya-Tanya Tumbuh",
              platform: "IG Stories · weekly",
              role: "Polls and Q&A feeding the Tanya IKEA pillar; the engine's listening post for new content ideas.",
            },
          ],
        },
      ],
    },
    cadence: {
      heading: "12-month cadence",
      intro:
        "A quarterly rhythm that flexes around the campaign calendar — the social engine amplifies each peak and keeps the platform warm in between.",
      blocks: [
        {
          kind: "cadence",
          entries: [
            {
              period: "Q1 · Jan–Mar",
              theme: "Mulai Tumbuh",
              beats: [
                "New-year home reset content synced with Hari Ruang Keluarga launch",
                "Semester-2 Sudut Belajar drops",
                "Ramadan ramp-up: home-prep teasers in late Q1",
              ],
            },
            {
              period: "Q2 · Apr–Jun",
              theme: "Ramadan & Lebaran di Rumah",
              beats: [
                "Daily sahur-countdown series during Ramadan",
                "Iftar hosting and Lebaran guest-ready content",
                "Post-Lebaran 'rapikan kembali' storage week",
              ],
            },
            {
              period: "Q3 · Jul–Sep",
              theme: "Kembali Sekolah",
              beats: [
                "Back-to-school Sudut Belajar burst (peak month: July)",
                "Makeover Menit doubles cadence for the school season",
                "Family weekend routines content as schools settle",
              ],
            },
            {
              period: "Q4 · Okt–Des",
              theme: "Tumbuh Bersama di Akhir Tahun",
              beats: [
                "Year-end hosting and gathering solutions",
                "12-months-of-growth recap UGC campaign",
                "Holiday gifting from the kids' range, priced and bundled",
              ],
            },
          ],
        },
      ],
    },
  },

  "track-content-retail": {
    pillars: {
      heading: "Retail activation pillars",
      intro:
        "Four in-store and activation themes that turn Ruang Tumbuh into store visits — the retail proof Rina Sari wants to see.",
      blocks: [
        {
          kind: "content-pillars",
          pillars: [
            {
              name: "Jalur Tumbuh",
              description:
                "In-store journey signage that turns the showroom walk into a family growth story — each department a chapter, the growth ruler as wayfinding.",
              examplePost:
                "Department arch: 'Bab 3 — Kamar yang Ikut Besar. Solusi kamar anak mulai Rp 1.999.000.'",
            },
            {
              name: "Ruang Contoh 36m²",
              description:
                "Real-size Indonesian room sets — a full 36m² home staged in-store proving every claim the campaigns make.",
              examplePost:
                "Room-set placard: 'Rumah ini 36m². Hitung sendiri: total isi rumah Rp 28.5jt.'",
            },
            {
              name: "Bawa Pulang Hari Ini",
              description:
                "Price-point and bundle displays near checkout — the conversion layer that turns inspiration into a same-day basket.",
              examplePost:
                "Exit display: 'Mulai tumbuh hari ini — sudut baca lengkap Rp 1.2jt, muat di motor.'",
            },
            {
              name: "Akhir Pekan Keluarga",
              description:
                "Weekend in-store family activations — workshops and kids' activities that make the store itself a ruang tumbuh.",
              examplePost:
                "Event card: 'Sabtu ini: rakit rak pertamamu bersama Ayah. Gratis, daftar di pintu masuk.'",
            },
          ],
        },
      ],
    },
    formats: {
      heading: "Retail format system",
      intro:
        "Repeatable retail content formats the store team can refresh on a fixed rhythm without new creative development each time.",
      blocks: [
        {
          kind: "format-system",
          formats: [
            {
              name: "Tur Ruang Contoh",
              platform: "In-store video screens · monthly refresh",
              role: "Looping room-set tour connecting the staged 36m² home to shoppable SKU lists.",
            },
            {
              name: "Cerita Rak",
              platform: "Shelf talkers · per planogram cycle",
              role: "One-line growth stories on shelf edge: what this product becomes as the family grows, plus price.",
            },
            {
              name: "Scan Sudut Ini",
              platform: "QR placards on room sets",
              role: "QR to a mobile landing with the full corner shopping list, stock check and delivery options.",
            },
            {
              name: "Bengkel Akhir Pekan",
              platform: "In-store events · weekly",
              role: "Family workshop kit (assembly, styling, kids' activities) anchoring the Akhir Pekan Keluarga pillar.",
            },
            {
              name: "Pesan Pulang",
              platform: "Bags, receipts & exit displays",
              role: "Last-touch platform message: 'Sediakan ruang untuk bertumbuh' with next-visit bundle teaser.",
            },
          ],
        },
      ],
    },
    cadence: {
      heading: "12-month retail cadence",
      intro:
        "Quarterly retail rhythm locked to the campaign calendar — every store zone refresh lands two weeks before its media peak.",
      blocks: [
        {
          kind: "cadence",
          entries: [
            {
              period: "Q1 · Jan–Mar",
              theme: "Mulai Tumbuh di Toko",
              beats: [
                "Hari Ruang Keluarga in-store takeover with launch room sets",
                "Semester-2 study corner zone in kids' department",
                "Pasar Ramadan zone build starts late March",
              ],
            },
            {
              period: "Q2 · Apr–Jun",
              theme: "Pasar Ramadan & Lebaran",
              beats: [
                "Hosting room sets: extendable dining + guest sleeping solutions",
                "Ramadan bundle pricing on dining, storage and textiles",
                "Post-Lebaran storage and reset displays",
              ],
            },
            {
              period: "Q3 · Jul–Sep",
              theme: "Zona Kembali Sekolah",
              beats: [
                "Sudut Belajar real-scale corner in high-traffic aisle",
                "Weekend assembly workshops for study furniture",
                "School-year bundles under Rp 2jt at exit displays",
              ],
            },
            {
              period: "Q4 · Okt–Des",
              theme: "Akhir Tahun Bersama",
              beats: [
                "Year-end family weekend event series",
                "Gifting and hosting displays from the kids' and dining range",
                "FY27 platform recap wall: 12 months of Ruang Tumbuh in store",
              ],
            },
          ],
        },
      ],
    },
  },
};

export function getTrackSubStepOutput(
  trackStepId: string,
  subStepId: string,
  trackType?: PitchTrackType
): PitchTrackSubStepOutput | undefined {
  const direct = TRACK_OUTPUTS[trackStepId]?.[subStepId];
  if (direct) return direct;
  // Dynamic tracks fall back to the canned dataset of their type
  if (trackType) {
    return TRACK_OUTPUTS[CANNED_TRACK_BY_TYPE[trackType]]?.[subStepId];
  }
  return undefined;
}

/** Convert a deliverable into the editable track-input shape */
export function deliverableToTrackInput(
  deliverable: PitchDeliverable
): NewPitchTrackInput {
  return {
    title: deliverable.title,
    type: deliverable.type,
    summary: deliverable.summary,
    planLabel: deliverable.planLabel,
    reasoning: deliverable.reasoning,
    sourceExcerpt: deliverable.sourceExcerpt,
    sourcePage: deliverable.sourcePage,
    evidenceStrength: deliverable.evidenceStrength,
    evidenceSignals: deliverable.evidenceSignals,
  };
}

/** Build up to 3 scope options (Lean / Balanced / Ambitious) from a track list. */
export function buildScopeOptions(
  all: NewPitchTrackInput[],
  ambitiousExtraTracks?: NewPitchTrackInput[]
): PitchScopeOption[] {
  // Lean: one of each type, prioritising order of appearance, min 1.
  const seenTypes = new Set<PitchTrackType>();
  const lean: NewPitchTrackInput[] = [];
  for (const track of all) {
    if (!seenTypes.has(track.type)) {
      seenTypes.add(track.type);
      lean.push(track);
    }
  }
  const leanTracks = lean.length > 0 ? lean : all.slice(0, 1);

  const options: PitchScopeOption[] = [];
  if (leanTracks.length < all.length) {
    options.push({
      id: "lean",
      label: "Lean",
      description: `Tightest scope — ${leanTracks.length} track${
        leanTracks.length === 1 ? "" : "s"
      }, one per deliverable type. Fastest to pitch.`,
      tracks: leanTracks,
    });
  }
  options.push({
    id: "balanced",
    label: "Balanced",
    description: `Exactly what the AI detected in the brief — ${all.length} track${
      all.length === 1 ? "" : "s"
    }. Recommended.`,
    tracks: all,
  });
  if (ambitiousExtraTracks && ambitiousExtraTracks.length > 0) {
    options.push({
      id: "ambitious",
      label: "Ambitious",
      description: `Everything in the brief plus ${ambitiousExtraTracks.length} proactive track${
        ambitiousExtraTracks.length === 1 ? "" : "s"
      } that go beyond it.`,
      tracks: [...all, ...ambitiousExtraTracks],
    });
  }
  return options;
}

/** Derive up to 3 scope options (Lean / Balanced / Ambitious) for a case. */
export function getScopeOptions(decode: PitchCaseDecode): PitchScopeOption[] {
  return buildScopeOptions(
    decode.pitchPlan.deliverables.map(deliverableToTrackInput),
    decode.ambitiousExtraTracks
  );
}

/* ------------------------------------------------------------------ */
/* Multi-case registry — every study case the prototype can decode     */
/* ------------------------------------------------------------------ */

export type PitchCaseMeta = {
  id: string;
  decode: PitchCaseDecode;
  /** Brief text transcript fed to the real-AI decode path */
  transcript: string;
  form: {
    brand: string;
    project: string;
    deadline: string;
    pitchType: string;
  };
};

/** Filled in below once every decode + transcript is defined */
export const PITCH_CASES: Record<string, PitchCaseMeta> = {} as Record<
  string,
  PitchCaseMeta
>;

export const DEFAULT_CASE_ID = "ikea";

export function getCaseDecode(caseId: string | undefined): PitchCaseDecode {
  return (PITCH_CASES[caseId ?? DEFAULT_CASE_ID] ?? PITCH_CASES[DEFAULT_CASE_ID])
    .decode;
}

/** AI suggestion prefill for the /pitch/new creation page (IKEA default) */
export const SUGGESTED_TRACKS: NewPitchTrackInput[] =
  IKEA_DECODE.pitchPlan.deliverables.map(deliverableToTrackInput);

export const SUGGESTED_PITCH_FORM = {
  brand: "IKEA",
  project: "Brand Agency Collaboration FY27",
  deadline: "May 11, 2026",
  pitchType: "Competition Pitch",
} as const;

/* ------------------------------------------------------------------ */
/* Scripted chat                                                       */
/* ------------------------------------------------------------------ */

export type PitchChatScriptMessage = {
  id: string;
  text: string;
  /** ms after the previous message */
  delay: number;
};

/** Played once when a newly created pitch lands on Brief Decoder */
export const PITCH_DECODE_SCRIPT: PitchChatScriptMessage[] = [
  {
    id: "decode-1",
    text: "Brief received. Reading IKEA_Creative_Brief_FY27_Updated.pdf…",
    delay: 600,
  },
  {
    id: "decode-2",
    text: "Decoded. Business Briefcase sections A–E populated. 1 field tagged [NEEDS INFO]: competing agency list. Review each section and fill the gap before approving.",
    delay: 2600,
  },
  {
    id: "decode-3",
    text: "Brief Essence: “Sediakan Ruang Untuk Bertumbuh”. Project type: Full Brand Platform + L1 Campaign.",
    delay: 1800,
  },
  {
    id: "decode-4",
    text: "I also drafted your Pitch Plan — I detected 6 deliverables in this brief: 1 Brand Platform, 3 Campaigns and 2 Content Strategies. Approve the Business Briefcase to review the plan.",
    delay: 1800,
  },
];

/** Played when entering a step in the canvas */
export const PITCH_STEP_SCRIPTS: Record<string, PitchChatScriptMessage[]> = {
  [PITCH_WORK_HUB_ID]: [
    {
      id: "wh-1",
      text: "This is the Work hub — every deliverable track detected from the brief, running in parallel from the same locked foundation. Pick any track to start; I've pre-drafted the first sub-step of each.",
      delay: 600,
    },
  ],
  "brief-decoder": [
    {
      id: "bd-1",
      text: "This is the decoded Business Briefcase from IKEA_Creative_Brief_FY27_Updated.pdf. One field still needs info: competing agencies. Everything else is ready for your review.",
      delay: 600,
    },
  ],
  "pitch-plan": [
    {
      id: "pp-1",
      text: "Here's the Pitch Plan. From the brief I detected 6 deliverables: 1 Brand Platform, 3 Campaigns and 2 Content Strategies. They all share one foundation, then run in parallel.",
      delay: 600,
    },
    {
      id: "pp-2",
      text: "If the client drops a deliverable later, you can re-open this step and I'll rebalance the plan. Approve when the split looks right.",
      delay: 1600,
    },
  ],
  "research-4c": [
    {
      id: "r4c-1",
      text: "Research 4C is grounded in the brand tracker, a category comms audit and a 90-day social scrape. The strongest signal: 'tumbuh' content is up 4× YoY — that's our cultural anchor.",
      delay: 600,
    },
  ],
  "comm-strategy": [
    {
      id: "cs-1",
      text: "I've drafted the GWTB strategy from the approved 4C research. The proposition locks the brief essence: “Sediakan Ruang Untuk Bertumbuh”. Want me to stress-test it against the decision makers' preferences?",
      delay: 600,
    },
  ],
  "big-ideas": [
    {
      id: "bi-1",
      text: "I generated 3 big idea candidates from the locked strategy. 'Ruang Tumbuh' scores highest (4.6/5) — strongest cultural anchor and clearest route into all 6 work tracks.",
      delay: 600,
    },
  ],
  "deck-builder": [
    {
      id: "dk-1",
      text: "Every work track is locked, so I've assembled the presentation: cover, foundation, all 6 deliverables and closing. Flip through the slides to review the narrative.",
      delay: 600,
    },
    {
      id: "dk-2",
      text: "When it looks right, hit Download PDF — I'll export the full deck, one slide per page, ready for the May 11 presentation.",
      delay: 1800,
    },
  ],
};

/** Per sub-step scripts, keyed by `${trackStepId}/${subStepId}` */
export const PITCH_SUB_STEP_SCRIPTS: Record<string, PitchChatScriptMessage[]> =
  {
    "track-brand-platform/positioning": [
      {
        id: "bp-pos-1",
        text: "I've drafted the positioning territory from the locked GWTB and 'Ruang Tumbuh'. The claim: IKEA owns 'small space, growing family' — nobody in the category holds it yet. Three pillars keep it honest: real moments, every corner counts, real prices.",
        delay: 600,
      },
      {
        id: "bp-pos-2",
        text: "Approve the territory and I'll translate it into the key visual system next.",
        delay: 1800,
      },
    ],
    "track-brand-platform/kv-system": [
      {
        id: "bp-kv-1",
        text: "Here's the visual system: IKEA Blue stays the anchor, a warm 'tumbuh' accent palette comes in, and the growth ruler device ties every campaign KV together — like marking a child's height on a doorframe.",
        delay: 600,
      },
    ],
    "track-brand-platform/voice": [
      {
        id: "bp-voice-1",
        text: "Brand voice is codified: hangat bukan menggurui, bahasa rumah, optimis terhadap yang kecil. I've written example lines the in-house team can pattern-match — every one lands on something attainable.",
        delay: 600,
      },
      {
        id: "bp-voice-2",
        text: "Approving this completes the Brand Platform track and feeds the voice rules into every campaign and content track.",
        delay: 1800,
      },
    ],
    "track-campaign-launch/main-kv": [
      {
        id: "cl-kv-1",
        text: "For the launch I'm proposing Hari Ruang Keluarga — a national day to rearrange the living room around what the family needs next. The hero KV catches a toddler's first steps into newly opened floor space.",
        delay: 600,
      },
      {
        id: "cl-kv-2",
        text: "Real SKUs and price callouts are in frame per the brief mandatories. Approve the KV and I'll build the 8-week plan around it.",
        delay: 1800,
      },
    ],
    "track-campaign-launch/planning": [
      {
        id: "cl-plan-1",
        text: "The launch plan runs 8 weeks in three phases — Tease, Launch, Sustain — aimed at 40% aided awareness and a 15% store-visit lift. That's the retail proof Rina Sari asked for.",
        delay: 600,
      },
    ],
    "track-campaign-launch/rollout": [
      {
        id: "cl-roll-1",
        text: "Rollout adapts the hero KV across OOH in 6 cities, TikTok creators, IG carousels, the YouTube masthead and in-store standees. The growth ruler survives every crop — that's the system working.",
        delay: 600,
      },
      {
        id: "cl-roll-2",
        text: "Approving rollout completes Hari Ruang Keluarga. Two more campaigns and the content engines to go.",
        delay: 1800,
      },
    ],
    "track-campaign-ramadan/main-kv": [
      {
        id: "cr-kv-1",
        text: "Ramadan di Rumah leads with a sahur scene — three generations around an extended NORDEN table at blue hour. Same small home, the most meaningful month of the year. Tone stays intimate, never promotional.",
        delay: 600,
      },
    ],
    "track-campaign-ramadan/planning": [
      {
        id: "cr-plan-1",
        text: "The plan locks to the Ramadan calendar: Persiapan two weeks out, sahur-slot media through weeks 1–3, then the Lebaran hosting peak. It's IKEA's biggest retail window — target is a 20% transaction lift.",
        delay: 600,
      },
      {
        id: "cr-plan-2",
        text: "Note the sahur-slot buys (03.00–05.00 WIB) — cheap inventory, maximum emotional relevance.",
        delay: 1800,
      },
    ],
    "track-campaign-ramadan/rollout": [
      {
        id: "cr-roll-1",
        text: "Rollout follows the day's rhythm: sahur countdown on TikTok, iftar styling on IG, mudik-route OOH saying 'Rumah Siap Menyambut', and the Pasar Ramadan zone in store. Approve to lock the seasonal track.",
        delay: 600,
      },
    ],
    "track-campaign-belajar/main-kv": [
      {
        id: "cb-kv-1",
        text: "Sudut Belajar's hero KV is one corner of a shared bedroom turned study nook — 'Satu Sudut, Sejuta Cita-cita.' Full corner under Rp 2jt, every SKU price-tagged. The most attainable expression of Ruang Tumbuh.",
        delay: 600,
      },
    ],
    "track-campaign-belajar/planning": [
      {
        id: "cb-plan-1",
        text: "This one's always-on, synced to the school calendar: bursts at both semester starts, steady monthly drops between, and an exam-season beat in April–May. It keeps the platform warm between campaign peaks.",
        delay: 600,
      },
    ],
    "track-campaign-belajar/rollout": [
      {
        id: "cb-roll-1",
        text: "Rollout is deliberately lightweight — monthly TikTok makeovers, saveable IG carousels, a marketplace storefront and one real study corner in store. All formats the in-house team can sustain without us.",
        delay: 600,
      },
      {
        id: "cb-roll-2",
        text: "Approve and all three campaigns are locked.",
        delay: 1800,
      },
    ],
    "track-content-social/pillars": [
      {
        id: "cs-pil-1",
        text: "Four social pillars: Ruang Cerita (real family stories), Trik Tumbuh (SKU hacks), Sudut demi Sudut (serialized makeovers) and Tanya IKEA (community Q&A). Together they're the daily engine the brief asked the in-house team to run.",
        delay: 600,
      },
    ],
    "track-content-social/formats": [
      {
        id: "cs-fmt-1",
        text: "Each pillar maps to a named, repeatable format — Ruang Tumbuh Diaries, Makeover Menit, Hitung Ruang, Live Tur Rumah, Tanya-Tanya Tumbuh. The team produces to a system, not from scratch.",
        delay: 600,
      },
    ],
    "track-content-social/cadence": [
      {
        id: "cs-cad-1",
        text: "The 12-month cadence flexes around the campaign calendar: Mulai Tumbuh in Q1, Ramadan in Q2, Kembali Sekolah in Q3, year-end togetherness in Q4. Approve to lock the social engine.",
        delay: 600,
      },
    ],
    "track-content-retail/pillars": [
      {
        id: "ct-pil-1",
        text: "Retail gets four pillars: Jalur Tumbuh wayfinding, the real-size Ruang Contoh 36m², Bawa Pulang Hari Ini conversion displays, and Akhir Pekan Keluarga activations. Every one is built to turn the platform into store visits.",
        delay: 600,
      },
    ],
    "track-content-retail/formats": [
      {
        id: "ct-fmt-1",
        text: "Five retail formats on fixed refresh rhythms — room-set tour screens, shelf-edge growth stories, QR corner scans, weekend workshop kits and last-touch bag messaging. The store team refreshes, never reinvents.",
        delay: 600,
      },
    ],
    "track-content-retail/cadence": [
      {
        id: "ct-cad-1",
        text: "Retail cadence locks to the media calendar — every zone refresh lands two weeks before its campaign peak, from the launch takeover in Q1 to the FY27 recap wall in Q4.",
        delay: 600,
      },
      {
        id: "ct-cad-2",
        text: "Approve this and all 6 work tracks are complete — Export Presentation unlocks next.",
        delay: 1800,
      },
    ],
  };

const TRACK_SCRIPT: PitchChatScriptMessage[] = [
  {
    id: "tr-1",
    text: "This track is unlocked — the shared foundation is approved. Work through its sub-steps in order; I've pre-drafted each one from the locked big idea.",
    delay: 600,
  },
];

export function getPitchStepScript(
  stepId: string,
  subStepId?: string,
  stepDef?: PitchStepDef
): PitchChatScriptMessage[] {
  const def = stepDef ?? getPitchStepDef(stepId);
  if (def?.kind === "track") {
    const subSteps = getTrackSubStepsForDef(def);
    const targetSubStepId = subStepId ?? subSteps[0]?.id;
    if (targetSubStepId) {
      const script = PITCH_SUB_STEP_SCRIPTS[`${stepId}/${targetSubStepId}`];
      if (script) return script;
      // Dynamic tracks reuse the canned scripts of their type
      if (def.trackType) {
        const canned =
          PITCH_SUB_STEP_SCRIPTS[
            `${CANNED_TRACK_BY_TYPE[def.trackType]}/${targetSubStepId}`
          ];
        if (canned) return canned;
      }
    }
    return TRACK_SCRIPT;
  }
  if (subStepId) {
    const script = PITCH_SUB_STEP_SCRIPTS[`${stepId}/${subStepId}`];
    if (script) return script;
  }
  return PITCH_STEP_SCRIPTS[stepId] ?? [];
}

/** Canned agent reply when the user sends a message inside a pitch session */
export function getPitchChatReply(stepLabel: string): string {
  return `Got it — I'll fold that into ${stepLabel}. I've noted it against the canvas; once you approve this step I'll carry the note into every downstream track.`;
}

/* ================================================================== */
/* Additional study cases — BFGoodrich (≈2 tracks) & Sunsilk (≈4)      */
/* ================================================================== */

export const GOODRICH_DECODE: PitchCaseDecode = {
  briefFileName: "BFGoodrich_Awareness_Project_Brief.pdf",
  briefEssence: "Bikin BFGoodrich On Road Viral di Indonesia",
  projectType: "Awareness Video Production",
  businessBrief: [
    {
      id: "logistics",
      letter: "A",
      title: "Logistics",
      fields: [
        {
          label: "Deliverables",
          value:
            "1 video concept, 2 durations (1× 60s + 1× 30s), each in 2 sizes (9×16 & 16×9). Main placement: Instagram, YouTube, TikTok + an offline event.",
        },
        { label: "Budget", value: "Rp 500 juta" },
        {
          label: "Timeline & Milestones",
          value:
            "Kick-off to agency 10 Jun · Proposal 24 Jun · Approval 1 Jul · Production 8–12 Jul · Final delivery 15–22 Jul 2026.",
        },
        {
          label: "Project Folder",
          value: "Lark Drive › Pitches › BFGoodrich Awareness",
        },
      ],
    },
    {
      id: "business",
      letter: "B",
      title: "Business",
      fields: [
        {
          label: "Background",
          value:
            "BFGoodrich is a 150+ year American tire brand (acquired by Michelin in 1990), famous for OFFROAD tires. Awareness in Indonesia is very low, especially for its ONROAD range.",
        },
        {
          label: "Objective",
          value:
            "Introduce BFGoodrich On Road to Indonesia and boost awareness through virality — get acknowledged by the mass.",
        },
        {
          label: "Business Opportunity",
          value:
            "No tire brand owns the 'daily on-road tire that's awet (durable) AND ganteng (good-looking)' space. Viral content can leapfrog low awareness quickly.",
        },
        {
          label: "Strategy",
          value:
            "Go viral on mass media — the agency proposes the kind of communication that can make BFGoodrich viral.",
        },
      ],
    },
    {
      id: "product",
      letter: "C",
      title: "Product & Positioning",
      fields: [
        {
          label: "Brand",
          value: "BFGoodrich = Ban Mobil Harian yang Awet dan Ganteng.",
        },
        {
          label: "Product",
          value:
            "Advantage Touring — sidewall kokoh, kekuatan & keawetan lebih lama. g-Force Phenom — looks ganteng & performa gacor. Plus 6-year warranty from purchase date.",
        },
        {
          label: "Target Audience",
          value:
            "Indonesian car owners and enthusiasts; a younger mass audience reachable through social virality.",
        },
        {
          label: "Key Message",
          value:
            "BFGoodrich is an on-road tire — durable and good-looking for everyday driving.",
        },
      ],
    },
    {
      id: "pitch",
      letter: "D",
      title: "Pitch / Project",
      fields: [
        {
          label: "Mandatories",
          value:
            "Proposed brand ambassador / main actor: Gofar Hilman (the agency may decide if he suits the storyline). The communication must be able to make BFGoodrich viral.",
        },
        {
          label: "Success Criteria",
          value:
            "Virality and awareness — being acknowledged by the mass across IG, YouTube, TikTok and the offline event.",
        },
        {
          label: "Creative Considerations",
          value:
            "Freedom for the agency to explore the storyline and whether Gofar Hilman fits as the lead. Don't limit creativity — come with the best, most efficient proposal.",
        },
      ],
    },
    {
      id: "people",
      letter: "E",
      title: "People & Insights",
      fields: [
        {
          label: "Insights",
          value:
            "BFGoodrich's offroad heritage overshadows its on-road range in Indonesia; most people don't know it makes daily tires at all.",
        },
        {
          label: "Competitors",
          value: "Other tire brands with stronger local awareness and dealer presence.",
        },
        {
          label: "Competing Agencies",
          value: "Not disclosed in the brief.",
          needsInfo: true,
        },
        {
          label: "Remarks",
          value:
            "Tight production window (kick-off 10 Jun → final delivery 15–22 Jul). Budget Rp 500 juta.",
        },
      ],
    },
  ],
  stakeholders: [
    {
      id: "marketing-lead",
      name: "BFGoodrich Marketing Lead",
      role: "Brand Marketing (Indonesia)",
      motivation:
        "Wants undeniable virality — a piece of content the mass actually shares, proving on-road awareness can be built fast on a lean budget.",
      influence: "high",
      winningHook:
        "Show a clear, repeatable viral mechanic (not just a nice film) and how it spreads across IG/TikTok/YouTube + the offline event.",
    },
    {
      id: "michelin-brand",
      name: "Regional Brand Custodian",
      role: "Michelin group brand guardian",
      motivation:
        "Protects the BFGoodrich brand equity — the 'awet & ganteng' message and product truth must survive the meme.",
      influence: "medium",
      winningHook:
        "Tie the viral idea straight to the product truth (sidewall, looks, 6-yr warranty) so virality also builds the right associations.",
    },
  ],
  winningAngles: [
    {
      id: "gofar-community",
      angle:
        "Beyond just casting Gofar Hilman, plug into his automotive/community credibility — co-create with his audience so the launch lands inside a real car-culture conversation, not as an ad.",
      linkedStakeholderId: "marketing-lead",
      rationale:
        "The brief only proposes Gofar as an actor; using his community as a distribution engine is the un-briefed move that buys real virality on a Rp 500jt budget.",
    },
    {
      id: "awet-ganteng-meme",
      angle:
        "Build the whole idea around an ownable, meme-able line — 'Awet dan Ganteng' — designed from day one to be remixed by users, not just broadcast.",
      linkedStakeholderId: "michelin-brand",
      rationale:
        "A line that carries the product truth and is built for remix keeps brand equity intact while maximising shareability.",
    },
  ],
  pitchPlan: {
    headline: "2 deliverable tracks detected from this brief",
    note: "This is a focused video-production brief — one creative idea expressed as a 60s hero and a 30s cutdown across 2 aspect ratios. The AI detected 2 content tracks, no brand or campaign-platform work. The AI only detects how many tracks and what type; the creative idea is yours.",
    deliverables: [
      {
        stepId: "track-content-hero",
        type: "content",
        planLabel: "Content Track 1 — Hero Film",
        title: "Hero Film (60s)",
        summary:
          "The 60-second hero film carrying the viral idea, mastered in 9×16 and 16×9 for YouTube and social.",
        source: "Brief §Deliverable — '1× 60 second, in 9×16 & 16×9'",
        reasoning:
          "The deliverables table specifies a single video concept with a 60-second cut in two sizes. The AI treats the hero film as one content track because it's the master asset everything else is derived from.",
        sourceExcerpt: "Deliverable: \"1 VIDEO, 2 DURATION, 2 SIZES — Video 1: 1× 60 second, in 9×16 & 16×9.\"",
        sourcePage: "Brief p.4 — Objective & Deliverable",
      },
      {
        stepId: "track-content-cutdown",
        type: "content",
        planLabel: "Content Track 2 — Social Cutdown",
        title: "Social Cutdown (30s)",
        summary:
          "The 30-second cutdown optimised for TikTok/Reels feeds, in 9×16 and 16×9.",
        source: "Brief §Deliverable — '1× 30 second, in 9×16 & 16×9'",
        reasoning:
          "A separate 30s duration is required across the same two sizes. Because short-form cutdowns are edited and distributed differently from the hero, the AI flagged them as their own content track.",
        sourceExcerpt: "Deliverable: \"Video 2: 1× 30 second, in 9×16 & 16×9.\"",
        sourcePage: "Brief p.4 — Objective & Deliverable",
      },
    ],
  },
  research4C: [
    {
      id: "company",
      title: "Company",
      subtitle: "BFGoodrich Indonesia",
      insight:
        "150+ years of heritage and Michelin backing, but in Indonesia the brand reads as 'offroad only' — on-road awareness is near zero.",
      takeaway: "Reintroduce BFGoodrich as a daily on-road tire, loudly.",
      source: "Brief background + category awareness scan",
    },
    {
      id: "category",
      title: "Category",
      subtitle: "Tires in Indonesia",
      insight:
        "Tire comms are function-first (grip, durability). Nobody plays in 'good-looking + durable daily tire' with personality.",
      takeaway: "Personality + virality is the white space.",
      source: "Category comms audit",
    },
    {
      id: "consumer",
      title: "Consumer",
      subtitle: "Car owners & enthusiasts",
      insight:
        "Younger drivers treat their car as self-expression; tires are an afterthought until something looks or feels off.",
      takeaway: "Make the tire part of the car's 'ganteng' story.",
      source: "Social listening on auto communities",
    },
    {
      id: "culture",
      title: "Culture",
      subtitle: "Indonesian car culture",
      insight:
        "Auto-creator content and 'review jujur' formats drive huge engagement; humour spreads fastest.",
      takeaway: "Ride creator-led, humorous formats for reach.",
      source: "TikTok/IG auto-content trend scan",
    },
  ],
  commStrategy: {
    get: "Indonesian car owners who care how their car looks and lasts",
    who: "have never thought of BFGoodrich as a daily on-road tire",
    to: "see BFGoodrich as the on-road tire that's awet dan ganteng",
    by: "making a genuinely shareable piece of content that puts the on-road range into car culture",
    proposition: "Awet dan Ganteng — ban harian yang bikin penasaran.",
  },
  bigIdeas: [
    {
      id: "awet-ganteng",
      title: "Awet dan Ganteng",
      premise:
        "A viral idea built on the tension between durability and good looks — the tire that survives Indonesian roads and still turns heads.",
      score: 4.3,
      selected: true,
    },
    {
      id: "on-road-debut",
      title: "BFGoodrich Turun ke Jalan",
      premise:
        "The offroad legend makes its on-road debut — a playful 'coming to the city' story starring a familiar face.",
      score: 3.9,
    },
  ],
  ambitiousExtraTracks: [
    {
      title: "Viral Amplification & Offline Event",
      type: "campaign",
      planLabel: "Campaign Track — Amplification",
      summary:
        "A lightweight amplification campaign + the offline event activation to push the film's reach beyond organic — beyond the core video deliverable.",
      reasoning:
        "The brief mentions an offline event placement but doesn't ask for a campaign. In the Ambitious scope the AI adds an amplification track to convert the film into a movement.",
      sourceExcerpt: "Main placement includes \"OFFLINE EVENT — strengthen brand presence…\".",
      sourcePage: "Brief p.6 — Main Placement (Ambitious scope)",
    },
  ],
};

export const SUNSILK_DECODE: PitchCaseDecode = {
  briefFileName: "Sunsilk_Steel_Launch_Agency_Brief.pdf",
  briefEssence: "Rambut Badai, Look-nya Mahal",
  projectType: "Product Launch Campaign + Content",
  businessBrief: [
    {
      id: "logistics",
      letter: "A",
      title: "Logistics",
      fields: [
        {
          label: "Deliverables",
          value:
            "(1) Campaign idea & management; (2) Mahalini social-media content production; (3) Campaign orchestration — Other Say & Brand Say content pillars; (4) Other-say briefs for KOL, publishers, community and affiliates.",
        },
        {
          label: "Budget",
          value: "Open — 'we don't want to limit your creativity, come with your best and efficient proposal'.",
        },
        {
          label: "Timeline & Milestones",
          value:
            "Briefing 8 May · Agency presentation 25–26 May · Announcement 27 May · Campaign period Jul–Dec 2026.",
        },
      ],
    },
    {
      id: "business",
      letter: "B",
      title: "Business",
      fields: [
        {
          label: "Background",
          value:
            "Sunsilk is launching 'Steel' — a Thick & Bouncy Hair range powered by Dynoxidil. The anti-hairfall category is stuck on functional problem-solution claims, while maximalist 'big hair' beauty is trending.",
        },
        {
          label: "Objective",
          value:
            "Raise awareness of the new Sunsilk Thick & Bouncy range and move from 'hairfall prevention' to delivering aesthetic, fuller-looking hair.",
        },
        {
          label: "Business Opportunity",
          value:
            "Own 'grow real big hair' beyond problem-solution — disrupt clinical sameness with Sunsilk's 'joyful science'.",
        },
        {
          label: "Strategy",
          value:
            "Social-first idea with Mahalini's co-creation product as the core, building talkability and an edgy, sassy brand image.",
        },
      ],
    },
    {
      id: "product",
      letter: "C",
      title: "Product & Positioning",
      fields: [
        {
          label: "Brand",
          value:
            "Sunsilk: from a basic shampoo brand to a sassy, dynamic, treatment-led beauty brand.",
        },
        {
          label: "Product",
          value:
            "Steel range — 4 steps (volumize, thicken, strengthen, grow) with Dynoxidil + folli peptides + zinc + ceramides. Claims: 2× faster growth, reduced hairfall, visibly denser hair.",
        },
        {
          label: "Target Audience",
          value:
            "Young women ('joyriders') with early hairfall signs who want aesthetic fullness, not just longevity — adopting preventive care beyond shampoo.",
        },
        {
          label: "Key Message",
          value: "Ditch the hacks — grow bouncy big hair for real.",
        },
      ],
    },
    {
      id: "pitch",
      letter: "D",
      title: "Pitch / Project",
      fields: [
        {
          label: "Mandatories",
          value:
            "Mahalini co-creation product is the core idea. All efficacy claims validated with local CTI/R&D. Tone: sassy, edgy, youthful.",
        },
        {
          label: "Success Criteria (KPIs)",
          value:
            "Sales uplift · buzz (brand mentions in Youscan) · brand power (drive 'edgy & cool brand') · awareness BLS uplift · high-engagement, organic talkability.",
        },
        {
          label: "Creative Considerations",
          value:
            "Translate 'Rambut Badai, Look-nya Mahal' into a fresh, culturally relevant execution that elevates Sunsilk as edgy and youthful via joyful science.",
        },
      ],
    },
    {
      id: "people",
      letter: "E",
      title: "People & Insights",
      fields: [
        {
          label: "Insights",
          value:
            "'Rambut badai' mentions are up +105% MAT; Mahalini is the social definition of perfect big hair. Hair 'hacks' are stressful and don't last.",
        },
        {
          label: "Competitors",
          value:
            "Anti-hairfall brands stuck on functional claims (reduce fall), none owning the aesthetic 'big hair' end-look.",
        },
        {
          label: "Competing Agencies",
          value: "Not disclosed in the brief.",
          needsInfo: true,
        },
        {
          label: "Remarks",
          value:
            "Mahalini SOWs still in discussion (exclusivity, co-creation claim rights, shoot outputs, boosting rights). BU-led local adaptation.",
        },
      ],
    },
  ],
  stakeholders: [
    {
      id: "bu-marketing",
      name: "Sunsilk BU Marketing Lead",
      role: "Brand Unit Marketing",
      motivation:
        "Wants to make Sunsilk distinctive and desirable again — buzz and brand-power shifts toward 'edgy & cool' matter most.",
      influence: "high",
      winningHook:
        "Lead with how the idea drives talkability and the 'edgy & cool' brand attribute, not just product claims.",
    },
    {
      id: "brand-manager",
      name: "Steel Brand Manager",
      role: "Product / Launch owner",
      motivation:
        "Accountable for sales uplift and the launch KPIs — needs the Mahalini co-creation to convert buzz into trial.",
      influence: "high",
      winningHook:
        "Show the path from Mahalini talkability to trial and sales, with the 'joyful science' proof making claims credible.",
    },
  ],
  winningAngles: [
    {
      id: "teambadai-superfans",
      angle:
        "Activate Mahalini's superfans (#TeamBadai) as co-creators from comment section to real product proof — turn her fanbase into the launch's earned-media engine.",
      linkedStakeholderId: "bu-marketing",
      rationale:
        "The brief centres Mahalini's content; mobilising her fandom as participants (not just audience) is the un-briefed move that manufactures organic buzz.",
    },
    {
      id: "joyful-science-demo",
      angle:
        "Invent a signature 'joyful science' demo format that makes Dynoxidil's growth claim visual and shareable — disrupting the clinical sameness of the category.",
      linkedStakeholderId: "brand-manager",
      rationale:
        "Makes the efficacy claims credible AND entertaining, bridging buzz to trial — exactly the brand-power + sales tension the BU is balancing.",
    },
  ],
  pitchPlan: {
    headline: "4 deliverable tracks detected from this brief",
    note: "The brief lists four agency deliverables spanning one campaign idea and three content/orchestration streams. The AI detected 1 campaign and 3 content tracks, all built on the Mahalini co-creation core. The AI only detects track count and type; the creative idea is yours.",
    deliverables: [
      {
        stepId: "track-campaign-idea",
        type: "campaign",
        planLabel: "Campaign Track 1 — Big Idea & Management",
        title: "Campaign Idea & Management",
        summary:
          "The core social-first campaign idea built on Mahalini's co-creation, plus end-to-end campaign management.",
        source: "Brief §Agency Deliverables — 'Campaign idea and management'",
        reasoning:
          "Deliverable #1 is explicitly the campaign idea and its management. That's the strategic campaign track every content stream hangs off, so the AI detected it as a single campaign track.",
        sourceExcerpt: "Agency Deliverables: \"1. Campaign idea and management.\"",
        sourcePage: "Brief p.38 — Agency Deliverables",
      },
      {
        stepId: "track-content-mahalini",
        type: "content",
        planLabel: "Content Track 1 — Talent Content",
        title: "Mahalini Social Content Production",
        summary:
          "Production of Mahalini's social-media content (Reels/TikTok) per the co-creation SOW.",
        source: "Brief §Agency Deliverables — 'Mahalini social media contents production'",
        reasoning:
          "Deliverable #2 is talent content production — a distinct content stream with its own shoot/SOW. The AI separates it from orchestration because it's produced, not just planned.",
        sourceExcerpt: "Agency Deliverables: \"2. Mahalini social media contents production.\"",
        sourcePage: "Brief p.38 — Agency Deliverables",
      },
      {
        stepId: "track-content-orchestration",
        type: "content",
        planLabel: "Content Track 2 — Content Pillars",
        title: "Campaign Orchestration (Brand Say + Other Say)",
        summary:
          "The content-pillar system orchestrating Brand Say and Other Say across the campaign.",
        source: "Brief §Agency Deliverables — 'content pillars of Other Say and Brand Say'",
        reasoning:
          "Deliverable #3 defines the content-pillar architecture. The AI flagged it as a content track because it governs how every piece is themed and sequenced.",
        sourceExcerpt: "Agency Deliverables: \"3. Campaign orchestration: content pillars of Other Say and Brand Say.\"",
        sourcePage: "Brief p.38 — Agency Deliverables",
      },
      {
        stepId: "track-content-othersay",
        type: "content",
        planLabel: "Content Track 3 — Other-Say / Influencer",
        title: "Other-Say Briefs (KOL, Publishers, Community, Affiliates)",
        summary:
          "Briefs and content guidance for KOLs, publishers, community and affiliates that make up the Other Say layer.",
        source: "Brief §Agency Deliverables — 'Other say briefs: KOL, publishers, community, affiliates'",
        reasoning:
          "Deliverable #4 is the influencer/earned ecosystem. It has its own briefing and partner management, so the AI detected it as a separate content track.",
        sourceExcerpt: "Agency Deliverables: \"4. Other say briefs: KOL, publishers, community, affiliates.\"",
        sourcePage: "Brief p.38 — Agency Deliverables",
      },
    ],
  },
  research4C: [
    {
      id: "company",
      title: "Company",
      subtitle: "Sunsilk",
      insight:
        "Seen as a basic, grocery shampoo brand; needs to become distinctive and desirable again as treatment-led beauty.",
      takeaway: "Reframe Sunsilk as edgy, treatment-led big-hair beauty.",
      source: "Brand vision (brief 'from–to')",
    },
    {
      id: "category",
      title: "Category",
      subtitle: "Anti-hairfall haircare",
      insight:
        "Category is stuck on functional problem-solution claims; 'growth' & 'density' innovation is rising (+26.9% treatments).",
      takeaway: "Own the aesthetic 'big hair' end-look, not just prevention.",
      source: "Category innovation data (brief)",
    },
    {
      id: "consumer",
      title: "Consumer",
      subtitle: "Young women / joyriders",
      insight:
        "They want bold, expressive big hair and rely on stressful 'hacks' to fake fullness that thin hair can't pull off.",
      takeaway: "Offer real big hair so they can ditch the hacks.",
      source: "Social insight & human truth (brief)",
    },
    {
      id: "culture",
      title: "Culture",
      subtitle: "Maximalist beauty",
      insight:
        "Maximalist 'big hair' is back as main-character energy; 'rambut badai' mentions +105%, Mahalini is the benchmark.",
      takeaway: "Anchor in 'Rambut Badai' with Mahalini as proof.",
      source: "Social signal (brief)",
    },
  ],
  commStrategy: {
    get: "young women whose looks are compromised by hairfall signs",
    who: "see hair-fall products as purely functional and rely on stressful hacks for fullness",
    to: "desire Sunsilk Thick & Bouncy as the way to grow real, fuller, bouncier hair",
    by: "co-creating with Mahalini and disrupting clinical sameness with joyful science",
    proposition: "Rambut Badai, Look-nya Mahal — grow real big hair.",
  },
  bigIdeas: [
    {
      id: "rambut-mahal-ini",
      title: "Rambut Mahal(ini)!",
      premise:
        "Mahalini spills her thick-hair secret — co-creating with Sunsilk so everyone can get badai hair, turning her most-asked question into the campaign.",
      score: 4.5,
      selected: true,
    },
    {
      id: "ditch-the-hacks",
      title: "Ditch the Hacks",
      premise:
        "A playful takedown of stressful hair hacks vs. the real thing — joyful science that actually grows big hair.",
      score: 4.0,
    },
  ],
  ambitiousExtraTracks: [
    {
      title: "Sunsilk Brand Platform Refresh",
      type: "brand",
      planLabel: "Brand Platform Track",
      summary:
        "A longer-term brand-platform refresh repositioning Sunsilk as edgy/treatment-led beyond this single launch — beyond the brief's scope.",
      reasoning:
        "The brief is launch-scoped, but the 'from basic shampoo to desirable beauty brand' ambition implies platform work. The AI offers it only in the Ambitious scope.",
      sourceExcerpt: "Brandverse: \"make Sunsilk distinctive and desirable again.\"",
      sourcePage: "Brief p.49 — Brandverse (Ambitious scope)",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Bundled brief transcripts (fed to the real-AI decode path)         */
/* ------------------------------------------------------------------ */

export const IKEA_TRANSCRIPT = `IKEA Creative Brief FY27 (Brand Agency Collaboration)
Brief essence: "Sediakan Ruang Untuk Bertumbuh".
Background: IKEA Indonesia enters FY27 with flat store traffic and rising competition from local modern furniture players (Informa, Vivere, Fabelio, Dekoruma, ACE Hardware).
Objective: reposition IKEA from "aspirational Scandinavian showroom" to "everyday partner for growing Indonesian families". Platform idea that compounds across the year, 3+ year longevity.
Opportunity: 73% of urban families live in homes under 90m²; nobody owns the "small space, growing family" territory.
Deliverables: brand platform, launch campaign, Ramadan & always-on campaigns, social + retail content strategy, final pitch deck.
Budget: IDR 3-5B. Timeline: briefing Apr 10, internal review May 2, submission May 5, presentation May 11 2026.
Target: urban parents 28-40, income IDR 8-25M/mo; secondary newlyweds.
Key message: whatever the size of your home, there is room for your family to grow.
Mandatories: IKEA logo rules, real product SKUs, price callouts, Bahasa Indonesia first.
Success: platform longevity (3+ years), campaign that lifts store visits, a content engine the in-house team can run.
Decision makers: Andika Pratama (Brand Lead) favors platform thinking; Rina Sari (Marketing Director) is ROI-driven and wants retail proof.`;

export const GOODRICH_TRANSCRIPT = `BFGoodrich Awareness Project — Video Production. Introducing BFGoodrich On Road to Indonesia.
Background: BFGoodrich is a 150+ year American tire brand acquired by Michelin in 1990, famous for OFFROAD tires. Awareness in Indonesia is very low, especially for its ONROAD tires. Goal: increase awareness via viral content on mass media.
Main communication: BFGoodrich = "Ban Mobil Harian yang Awet dan Ganteng". Advantage Touring = sidewall kokoh (kekuatan & keawetan lebih lama). g-Force Phenom = looks ganteng & performa gacor. 6-year warranty from purchase. From agency: propose communication that can make BFGoodrich viral.
Objective: introduce BFGoodrich to the Indonesia market as an On Road Tire; boost awareness through virality; be acknowledged by the mass.
Deliverable: 1 VIDEO, 2 DURATION, 2 SIZES. Video 1: 1x 60 second in 9x16 & 16x9. Video 2: 1x 30 second in 9x16 & 16x9.
Actor: proposing Gofar Hilman as main brand ambassador / main actor; agency may decide whether he suits the storyline.
Main placement: Instagram, YouTube, TikTok, Offline Event.
Budget: Rp 500 juta. Timeline: 10 June kick-off to agency, 24 June proposal, 1 July approval, 8-12 July production, 15-22 July final delivery.`;

export const SUNSILK_TRANSCRIPT = `Sunsilk Steel Launch — Agency Brief (April 2026).
Social insight & human truth: young women ("joyriders") want bold, expressive big hair; maximalist beauty is back. They rely on stressful "hacks" to fake fullness. So we say: grow real big hair. Idea: ditch the hacks, grow bouncy big hair for real.
Product truth: Sunsilk's joyful science. Steel range, 4 steps (volumize, thicken, strengthen, grow), powered by Dynoxidil + folli peptides + zinc salt + ceramides. Claims: 2x faster hair growth, reduces hairfall, visibly denser hair.
Localized creative: tension thin hair (rambut tipis) vs thick fuller hair (rambut tebal / rambut badai); mentions +105%. Mahalini = definition of perfect big hair. Idea: "Rambut Badai, Look-nya Mahal" — Sunsilk co-creates with Mahalini.
Communication objective: raise awareness of new Sunsilk Thick & Bouncy Hair; influence young women to use Sunsilk as hairfall prevention that also preserves aesthetic look.
Agency Deliverables: 1. Campaign idea and management. 2. Mahalini social media contents production. 3. Campaign orchestration: content pillars of Other Say and Brand Say. 4. Other say briefs: KOL, publishers, community, affiliates.
Timeline: briefing 8 May, agency presentation 25-26 May, announcement 27 May, campaign period July-December 2026. Budget: open ("don't limit your creativity").
KPIs: sales uplift; buzz (brand mentions in Youscan); brand power (drive "edgy and cool brand"); awareness BLS uplift; high-engagement organic talkability.
Mandatories: Mahalini co-creation core idea; validate claims with local CTI/R&D; sassy, edgy, youthful tone.`;

/* Populate the case registry (decodes + transcripts defined above) */
PITCH_CASES.ikea = {
  id: "ikea",
  decode: IKEA_DECODE,
  transcript: IKEA_TRANSCRIPT,
  form: {
    brand: "IKEA",
    project: "Brand Agency Collaboration FY27",
    deadline: "May 11, 2026",
    pitchType: "Competition Pitch",
  },
};
PITCH_CASES.goodrich = {
  id: "goodrich",
  decode: GOODRICH_DECODE,
  transcript: GOODRICH_TRANSCRIPT,
  form: {
    brand: "BFGoodrich",
    project: "Awareness Project — On Road Video",
    deadline: "Jul 22, 2026",
    pitchType: "Client Pitch",
  },
};
PITCH_CASES.sunsilk = {
  id: "sunsilk",
  decode: SUNSILK_DECODE,
  transcript: SUNSILK_TRANSCRIPT,
  form: {
    brand: "Sunsilk",
    project: "Steel Launch — Thick & Bouncy Hair",
    deadline: "May 26, 2026",
    pitchType: "Competition Pitch",
  },
};

/** Map a brief file name to its case id (used by the sample-brief picker) */
export function caseIdForFileName(fileName: string): string {
  const found = Object.values(PITCH_CASES).find(
    (entry) => entry.decode.briefFileName === fileName
  );
  return found?.id ?? DEFAULT_CASE_ID;
}

const CASE_STEPS_CACHE: Record<string, PitchStepDef[]> = {};

/** Build the default pipeline for a non-IKEA case from its detected tracks.
    IKEA keeps the hand-authored PITCH_STEPS (with deep TRACK_OUTPUTS), so this
    is only used for the other study cases. */
export function buildCaseSteps(caseId: string): PitchStepDef[] {
  if (caseId === DEFAULT_CASE_ID) return PITCH_STEPS;
  if (!CASE_STEPS_CACHE[caseId]) {
    const decode = getCaseDecode(caseId);
    CASE_STEPS_CACHE[caseId] = buildPitchSteps(
      decode.pitchPlan.deliverables.map(deliverableToTrackInput)
    );
  }
  return CASE_STEPS_CACHE[caseId];
}
