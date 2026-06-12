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
    description: "Decode the client brief into a structured business brief and pitch plan.",
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

export const PITCH_TRACK_TYPE_LABEL: Record<PitchTrackType, string> = {
  brand: "Brand Platform",
  campaign: "Campaign",
  content: "Content Strategy",
};

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
      "AI reads the raw client brief and decodes it into a structured Business Brief (sections A–E).",
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
  title: string;
  type: PitchTrackType;
  summary?: string;
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

export type PitchDeliverable = {
  stepId: string;
  type: PitchTrackType;
  title: string;
  summary: string;
  source: string;
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

export const IKEA_DECODE = {
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
          label: "Decision Makers",
          value:
            "Andika Pratama (Brand Lead) — favors platform thinking. Rina Sari (Marketing Director) — ROI-driven, wants retail proof.",
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

  pitchPlan: {
    headline: "6 deliverable tracks detected from this brief",
    note: "Based on the deliverables list, budget shape and the client's platform ambition, frndOS suggests splitting the work into 1 brand platform, 3 campaigns and 2 content strategies. All tracks share one foundation: Research 4C → Comm Strategy → Big Ideas.",
    deliverables: [
      {
        stepId: "track-brand-platform",
        type: "brand",
        title: "FY27 Brand Platform",
        summary:
          "The multi-year platform idea — positioning territory, visual system and brand voice that everything else plugs into.",
        source: "Brief §Objective — 'platform idea that compounds across the year'",
      },
      {
        stepId: "track-campaign-launch",
        type: "campaign",
        title: "Hari Ruang Keluarga (Launch)",
        summary:
          "L1 launch campaign introducing the platform to Indonesian families with a national moment.",
        source: "Brief §Deliverables — 'launch campaign'",
      },
      {
        stepId: "track-campaign-ramadan",
        type: "campaign",
        title: "Ramadan di Rumah (Seasonal)",
        summary:
          "Seasonal Ramadan campaign on togetherness at home — IKEA's biggest retail window.",
        source: "Brief §Deliverables — 'Ramadan campaign'",
      },
      {
        stepId: "track-campaign-belajar",
        type: "campaign",
        title: "Sudut Belajar (Always-on)",
        summary:
          "Always-on campaign around study corners for growing kids, sustaining the platform between peaks.",
        source: "Brief §Deliverables — 'always-on campaign'",
      },
      {
        stepId: "track-content-social",
        type: "content",
        title: "Social Content System",
        summary:
          "12-month social strategy: pillars, formats and cadence the in-house team can run.",
        source: "Brief §Success Criteria — 'content engine the in-house team can run'",
      },
      {
        stepId: "track-content-retail",
        type: "content",
        title: "Retail Activation Content",
        summary:
          "In-store and activation content connecting the platform to store visits.",
        source: "Brief §Success Criteria — 'campaign that lifts store visits'",
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
} as const;

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

/** AI suggestion prefill for the /pitch/new creation page */
export const SUGGESTED_TRACKS: NewPitchTrackInput[] =
  IKEA_DECODE.pitchPlan.deliverables.map((deliverable) => ({
    title: deliverable.title,
    type: deliverable.type,
    summary: deliverable.summary,
  }));

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
    text: "Decoded. Business Brief sections A–E populated. 1 field tagged [NEEDS INFO]: competing agency list. Review each section and fill the gap before approving.",
    delay: 2600,
  },
  {
    id: "decode-3",
    text: "Brief Essence: “Sediakan Ruang Untuk Bertumbuh”. Project type: Full Brand Platform + L1 Campaign.",
    delay: 1800,
  },
  {
    id: "decode-4",
    text: "I also drafted your Pitch Plan — I detected 6 deliverables in this brief: 1 Brand Platform, 3 Campaigns and 2 Content Strategies. Approve the Business Brief to review the plan.",
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
      text: "This is the decoded Business Brief from IKEA_Creative_Brief_FY27_Updated.pdf. One field still needs info: competing agencies. Everything else is ready for your review.",
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
