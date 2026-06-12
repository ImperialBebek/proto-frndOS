/** PROTOTYPE static data — Figma Brand page 2492:6699 */

export type BrandModuleTab =
  | "insights"
  | "studio"
  | "research"
  | "growth"
  | "loyalty";

/** v2 top nav tabs — Figma 2600:5298 */
export type BrandTopNavTabV2 =
  | "overview"
  | "campaigns"
  | "ads"
  | "social-media"
  | "influencer"
  | "atl"
  | "trend-signals"
  | "social-listening";

export const BRAND_TOP_NAV_TABS: {
  id: BrandTopNavTabV2;
  label: string;
}[] = [
  { id: "overview", label: "Overview" },
  { id: "campaigns", label: "Campaigns" },
  { id: "ads", label: "Ads" },
  { id: "social-media", label: "Social Media" },
  { id: "influencer", label: "Influencer" },
  { id: "atl", label: "ATL" },
  { id: "trend-signals", label: "Trend Signals" },
  { id: "social-listening", label: "Social Listening" },
];

export type ProgressMetric = {
  label: string;
  value: string;
  progress: number;
  progressColor: "positive" | "warning";
  badge: string;
  target: string;
};

export type SimpleMetric = {
  label: string;
  value: string;
};

export const QUICK_BRIEF_TEXT =
  "Ad spend and impressions are both on track, reaching 83% of their respective targets, which shows efficient use of budget and audience reach. Click performance is excellent at 110%, indicating high user engagement with our ads.";

export const QUICK_BRIEF_CHIPS = [
  "Why is Tangerang dropping?",
  "Simulate +20% Budget",
  "Draft Weekly Client Report",
] as const;

export const TOP_PROGRESS_METRICS: ProgressMetric[] = [
  {
    label: "Followers Growth",
    value: "1,500,000",
    progress: 35,
    progressColor: "positive",
    badge: "95%",
    target: "Target 30M",
  },
  {
    label: "Impressions",
    value: "30,200,000",
    progress: 35,
    progressColor: "positive",
    badge: "111%",
    target: "Target 3.5%",
  },
  {
    label: "Total Reach",
    value: "1,500,000",
    progress: 55,
    progressColor: "warning",
    badge: "79%",
    target: "Target 25K",
  },
  {
    label: "Engagement Rate",
    value: "4.8%",
    progress: 35,
    progressColor: "positive",
    badge: "83%",
    target: "Target 500",
  },
];

export const BREAKDOWN_ROW_METRICS: SimpleMetric[] = [
  { label: "Total Followers", value: "15,000,000" },
  { label: "Total Impressions", value: "28,400,000" },
  { label: "Total Reach", value: "1,500,000,000" },
  { label: "Total Reach Rate", value: "3.2%" },
];

export const BREAKDOWN_GRID_METRICS: SimpleMetric[] = [
  { label: "Total Likes", value: "250,000" },
  { label: "Total Comments", value: "650,000" },
  { label: "Total Shares", value: "72,000" },
  { label: "Total Saves", value: "45,000" },
  { label: "Total Engagements", value: "18,500,000" },
  { label: "Engagement Rate", value: "4.8%" },
];

/** v2 floating pills — scroll sections (Figma 2537:14183) */
export type BrandSectionId = "quick-brief" | "performance" | "audience";

export const BRAND_SECTION_IDS: BrandSectionId[] = [
  "quick-brief",
  "performance",
  "audience",
];

export const SECTION_SUGGESTIONS: Record<BrandSectionId, readonly string[]> = {
  "quick-brief": [
    "Why is Tangerang dropping?",
    "Simulate +20% Budget",
    "Draft Weekly Client Report",
  ],
  performance: [
    "Can we achieve the KPI this month?",
    "How can we increase reach?",
    "Which channel drove the most conversions?",
  ],
  audience: [
    "How can we increase reach?",
    "Who is our fastest-growing age segment?",
    "Compare audience vs last quarter",
  ],
};
