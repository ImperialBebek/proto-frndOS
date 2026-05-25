/** PROTOTYPE static data — Figma Home Page 2487:5908 */

export type TabId = "home" | "inbox" | "playground";

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
  logoUrl: string;
  badge: { text: string; variant: BadgeVariant };
  metrics: KpiMetric[];
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
    name: "OCBC",
    logoUrl:
      "https://www.figma.com/api/mcp/asset/c796f925-5987-4a7b-bced-635dfe519f49",
  },
  {
    id: "samsung",
    name: "Samsung",
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
    logoUrl:
      "https://www.figma.com/api/mcp/asset/ecbd4beb-ca50-4afc-aaa5-a156ddf30d61",
    badge: { text: "Low", variant: "low" },
    metrics: SHARED_METRICS,
  },
  {
    id: "aqua",
    name: "Aqua Indonesia",
    logoUrl:
      "https://www.figma.com/api/mcp/asset/cec322b4-60c0-4e79-93cb-bd557e747fb8",
    badge: { text: "Medium", variant: "medium" },
    metrics: SHARED_METRICS,
  },
  {
    id: "ocbc",
    name: "OCBC",
    logoUrl:
      "https://www.figma.com/api/mcp/asset/d3188d7c-3b2c-40ec-957a-46fe3c4cd3d1",
    badge: { text: "Monitoring", variant: "monitoring" },
    metrics: SHARED_METRICS,
  },
];
