/** PROTOTYPE static data — Figma Home Page 12001:2208 */

export type TabId = "home" | "inbox" | "playground" | "pitch" | "agents";

export type BadgeVariant = "low" | "medium" | "monitoring";

export type TrendVariant = "positive" | "negative";

export type Suggestion = {
  text: string;
  label: string;
};

export type KpiMetric = {
  label: string;
  value: string;
  trend?: { value: string; variant: TrendVariant };
};

export type BrandCard = {
  id: string;
  name: string;
  industry: string;
  logoUrl: string;
  badge: { text: string; variant: BadgeVariant };
  metrics: KpiMetric[];
};

export type WorkCard = {
  id: string;
  title: string;
  editedLabel: string;
  editor: string;
  thumbnailUrl?: string;
  placeholder?: boolean;
  showPlay?: boolean;
  playVariant?: "dark" | "light";
  fileType?: "image" | "document" | "video";
};

export type ToolCard = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  badge?: "image" | "kv" | "resizer" | "brief";
};

export type ScheduleEvent = {
  id: string;
  time: string;
  title: string;
  timeRange: string;
  description?: string;
  showJoin?: boolean;
};

export type UpdateCard = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  placeholderColor?: string;
};

export const USER_AVATAR_URL =
  "https://www.figma.com/api/mcp/asset/11cd4267-fbaf-4845-aa5f-ff7274d76b39";

export const DOCK_BRANDS = [
  {
    id: "ultra-milk",
    name: "Ultra Milk",
    logoUrl:
      "https://www.figma.com/api/mcp/asset/fa07916c-3a70-4d42-b8b2-4f7d5a97f2ee",
  },
  {
    id: "aqua",
    name: "Aqua Indonesia",
    logoUrl:
      "https://www.figma.com/api/mcp/asset/8962d271-b058-4e12-adce-5b5f33a92feb",
  },
  {
    id: "ocbc",
    name: "OCBC NISP",
    logoUrl:
      "https://www.figma.com/api/mcp/asset/c796f925-5987-4a7b-bced-635dfe519f49",
  },
  {
    id: "samsung",
    name: "Samsung Indonesia",
    logoUrl:
      "https://www.figma.com/api/mcp/asset/6441952f-c34e-4f43-9653-fa6f48dd2070",
  },
  {
    id: "go-jek",
    name: "Go-Jek",
    logoUrl:
      "https://www.figma.com/api/mcp/asset/6441952f-c34e-4f43-9653-fa6f48dd2070",
  },
] as const;

export const SUGGESTIONS: Suggestion[] = [
  {
    text: "Draft me a brief for Design Review at 12pm this afternoon",
    label: "Calendar",
  },
  {
    text: "Continue the visual concept for the newly created Homepage Revamp project",
    label: "Studio",
  },
  {
    text: "Help write copy for the campaign content currently running in Studio",
    label: "Studio",
  },
];

const SHARED_METRICS: KpiMetric[] = [
  {
    label: "Total Impressions",
    value: "361,054,292",
    trend: { value: "+4%", variant: "positive" },
  },
  { label: "Total Spend", value: "Rp 7,374,539,038" },
  {
    label: "Total Conversion",
    value: "5,783",
    trend: { value: "+0.8%", variant: "negative" },
  },
  { label: "Revenue", value: "Rp 223,761,131" },
];

export const BRAND_CARDS: BrandCard[] = [
  {
    id: "ultra-milk",
    name: "Ultra Milk",
    industry: "Consumer Packaged Goods",
    logoUrl:
      "https://www.figma.com/api/mcp/asset/7257f31d-a164-43bf-88e7-a364bb998d13",
    badge: { text: "Low", variant: "low" },
    metrics: SHARED_METRICS,
  },
  {
    id: "aqua",
    name: "Aqua Indonesia",
    industry: "Beverage Industry",
    logoUrl:
      "https://www.figma.com/api/mcp/asset/175e74ce-0898-479d-b7cb-37d1e36d4c46",
    badge: { text: "Medium", variant: "medium" },
    metrics: SHARED_METRICS,
  },
  {
    id: "ocbc",
    name: "Bank OCBC",
    industry: "Banking and Finance",
    logoUrl:
      "https://www.figma.com/api/mcp/asset/a70f4dcb-8da9-4866-ac6f-0ac8e59d72f3",
    badge: { text: "Monitoring", variant: "monitoring" },
    metrics: SHARED_METRICS,
  },
];

export const RECENT_WORK: WorkCard[] = [
  {
    id: "xg-collab",
    title: "XG Collab",
    editedLabel: "today",
    editor: "Sabrina",
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/c507a99b-2d91-4b00-bcf0-8abd0819d6b3",
    showPlay: true,
    playVariant: "dark",
    fileType: "image",
  },
  {
    id: "untitled",
    title: "Untitled project",
    editedLabel: "2 hours ago",
    editor: "Sabrina",
    placeholder: true,
    fileType: "document",
  },
  {
    id: "ultra-campaign",
    title: "Ultra Milk Campaign 2026",
    editedLabel: "2 hours ago",
    editor: "Diandra",
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/4c0e4969-fb41-4ce5-9d15-065e7f974e3e",
    showPlay: true,
    playVariant: "light",
    fileType: "video",
  },
  {
    id: "ultra-me-her",
    title: "ULTRA Me and Her",
    editedLabel: "yesterday",
    editor: "Sabrina",
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/5c1524a9-cc2f-4d03-a88c-540416212a66",
    showPlay: true,
    playVariant: "light",
    fileType: "document",
  },
];

export const TOOL_CARDS: ToolCard[] = [
  {
    id: "image-editor",
    title: "Image Editor",
    description:
      "Generate stunning visuals effortlessly with AI-driven technology. Perfect for mockups, social media, and more.",
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/0949012d-0d75-4bfe-8732-268438a4580a",
    badge: "image",
  },
  {
    id: "kv-generator",
    title: "KV Generator",
    description:
      "Produce impactful key visuals quickly using AI, ideal for presentations and marketing.",
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/21fef99b-a5c3-4d59-b595-5a852084d481",
    badge: "kv",
  },
  {
    id: "resizer",
    title: "Resizer",
    description:
      "Produce impactful key visuals quickly using AI, ideal for presentations and marketing.",
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/eb7ec71b-0587-4549-bf70-311cd0f0f956",
    badge: "resizer",
  },
  {
    id: "brief-generator",
    title: "Creative Brief Generator",
    description:
      "Produce impactful key visuals quickly using AI, ideal for presentations and marketing.",
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/67395010-7e10-467c-970e-cceb0accec4a",
    badge: "brief",
  },
];

export const SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    id: "standup",
    time: "09:00",
    title: "Morning Standup",
    timeRange: "09:30 - 10:00",
    showJoin: true,
  },
  {
    id: "client-sync",
    time: "12:00",
    title: "Client Sync",
    description: "Bi-weekly alignment with the Ultra Milk team.",
    timeRange: "12:00 - 14:00",
  },
  {
    id: "strategy",
    time: "15:00",
    title: "Brand Strategy Review",
    timeRange: "15:00 - 16:30",
  },
];

export const UPDATE_CARDS: UpdateCard[] = [
  {
    id: "brand-kit",
    title: "Brand Kit 3.0 is live",
    description: "New templates, icons & color palettes available now.",
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/2e7201bb-ffd9-4c1e-85f2-17a0bec51a45",
  },
  {
    id: "feedback",
    title: "User Feedback Integration",
    description: "We've added a feature to gather user suggestions directly.",
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/df04ef2a-f490-4631-acb8-0e57eb65bb32",
  },
  {
    id: "collab",
    title: "Enhanced Collaboration Tools",
    description: "Real-time editing and commenting for team projects.",
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/28d66cba-55df-4dba-961a-cfb49ce48b6b",
  },
  {
    id: "perf",
    title: "Performance Optimization Update",
    description:
      "Improved loading times and reduced lag for smoother design experience.",
    placeholderColor: "#224893",
  },
];
