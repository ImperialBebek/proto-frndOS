/** PROTOTYPE v3 sidebar nav — Figma 2608:5779 / 2614:8356 */

import type { ComponentType } from "react";
import {
  House,
  Tray,
  Cube,
  MagnifyingGlass,
  CardsThree,
  UsersThree,
  Lifebuoy,
  MapTrifold,
  Gear,
  ChartPieSlice,
  PaintBrush,
  ListMagnifyingGlass,
  ChartLineUp,
  Crown,
} from "@phosphor-icons/react";
import type { TabId } from "./homeStatic";
import { DOCK_BRANDS } from "./homeStatic";

type IconType = ComponentType<{
  size?: number;
  weight?: "fill" | "regular" | "bold";
  className?: string;
}>;

export type SidebarNavItem = {
  id: TabId | "search";
  label: string;
  icon: IconType;
  shortcut?: string[];
};

/** Figma 2614:8188 — frndOS wordmark + AI symbol */
export const V3_FRND_LOGO_URL =
  "https://www.figma.com/api/mcp/asset/1bcac02b-83ce-4c4d-b727-ca06b5487143";
export const V3_FRND_AI_DOT_URL =
  "https://www.figma.com/api/mcp/asset/385895d9-4348-4d9f-8449-5827c9b15134";

export const V3_WORKSPACE = {
  name: "Maleo Agency",
  logoUrl: DOCK_BRANDS[0].logoUrl,
} as const;

export const V3_PRIMARY_NAV: SidebarNavItem[] = [
  { id: "home", label: "Home", icon: House },
  { id: "search", label: "Search", icon: MagnifyingGlass, shortcut: ["⌘", "K"] },
  { id: "inbox", label: "Inbox", icon: Tray },
  { id: "playground", label: "Playground", icon: Cube },
  { id: "pitch", label: "Pitch", icon: CardsThree },
  { id: "agents", label: "Agents", icon: UsersThree },
];

/** Figma 12001:2208 — home sidebar brand list (Aqua stays on brand cards, not sidebar) */
export const V3_SIDEBAR_BRANDS = [
  DOCK_BRANDS[0],
  DOCK_BRANDS[2],
  DOCK_BRANDS[3],
  DOCK_BRANDS[4],
] as const;

export type SidebarFooterItem = {
  id: string;
  label: string;
  icon: IconType;
};

export const V3_FOOTER_NAV: SidebarFooterItem[] = [
  { id: "help", label: "Help & Contact", icon: Lifebuoy },
  { id: "roadmap", label: "Roadmap", icon: MapTrifold },
];

export const V3_BRAND_FOOTER_NAV: SidebarFooterItem[] = [
  { id: "brand-settings", label: "Brand settings", icon: Gear },
  { id: "help", label: "Help & Contact", icon: Lifebuoy },
  { id: "roadmap", label: "Roadmap", icon: MapTrifold },
];

/** Figma 2617:6530 — profile photo in v3 card top bar */
export const V3_USER_AVATAR_URL =
  "https://www.figma.com/api/mcp/asset/d767bcda-004d-433e-b5c9-5b78394b5e6e";

export const V3_USER = {
  name: "Rafly Nurfallah",
  avatarUrl: V3_USER_AVATAR_URL,
} as const;

/** Insights sub-items (formerly top tabs) — Figma 2614:8356 */
export type BrandInsightsTabId =
  | "overview"
  | "campaigns"
  | "ads"
  | "social-media"
  | "influencer"
  | "atl"
  | "trend-signals"
  | "social-listening";

export type BrandInsightsTab = {
  id: BrandInsightsTabId;
  label: string;
};

export const V3_BRAND_INSIGHTS_TABS: BrandInsightsTab[] = [
  { id: "overview", label: "Overview" },
  { id: "campaigns", label: "Campaigns" },
  { id: "ads", label: "Ads" },
  { id: "social-media", label: "Social Media" },
  { id: "influencer", label: "Influencer" },
  { id: "atl", label: "ATL" },
  { id: "trend-signals", label: "Trend Signal" },
  { id: "social-listening", label: "Social Listening" },
];

/** Brand sidebar modules — Figma 2614:8356 */
export type BrandModuleId =
  | "insights"
  | "studio"
  | "research"
  | "growth"
  | "loyalty";

export type BrandModule = {
  id: BrandModuleId;
  label: string;
  icon: IconType;
  subTabs?: readonly BrandInsightsTab[];
};

export const V3_BRAND_MODULES: BrandModule[] = [
  {
    id: "insights",
    label: "Insights",
    icon: ChartPieSlice,
    subTabs: V3_BRAND_INSIGHTS_TABS,
  },
  { id: "studio", label: "Studio", icon: PaintBrush },
  { id: "research", label: "Research", icon: ListMagnifyingGlass },
  { id: "growth", label: "Growth", icon: ChartLineUp },
  { id: "loyalty", label: "Loyalty", icon: Crown },
];

/** @deprecated use BrandInsightsTabId */
export type BrandTabId = BrandInsightsTabId;

/** @deprecated use V3_BRAND_INSIGHTS_TABS */
export const V3_BRAND_TABS = V3_BRAND_INSIGHTS_TABS;

export const V3_TAB_LABEL: Record<TabId, string> = {
  home: "Home",
  pitch: "Pitch",
  agents: "Agents",
  inbox: "Inbox",
  playground: "Playground",
};

export function getInsightsTabLabel(id: BrandInsightsTabId): string {
  return V3_BRAND_INSIGHTS_TABS.find((t) => t.id === id)?.label ?? "Overview";
}

export function getBrandModuleLabel(id: BrandModuleId): string {
  return V3_BRAND_MODULES.find((m) => m.id === id)?.label ?? id;
}

export function getBrandContentTitle(
  module: BrandModuleId,
  insightsTab: BrandInsightsTabId
): string {
  if (module === "insights") return getInsightsTabLabel(insightsTab);
  return getBrandModuleLabel(module);
}
