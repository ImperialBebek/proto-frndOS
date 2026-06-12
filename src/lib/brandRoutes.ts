import { DOCK_BRANDS } from "@/data/homeStatic";
import type { BrandInsightsTabId, BrandModuleId } from "@/data/navV3Static";
import { isKnownBrandId } from "@/lib/brandRegistry";

export type BrandId = (typeof DOCK_BRANDS)[number]["id"];

export const BRAND_NEW_PATH = "/brands/new";

const BRAND_MODULE_IDS = [
  "insights",
  "studio",
  "research",
  "growth",
  "loyalty",
] as const satisfies readonly BrandModuleId[];

const INSIGHTS_TAB_IDS = [
  "overview",
  "campaigns",
  "ads",
  "social-media",
  "influencer",
  "atl",
  "trend-signals",
  "social-listening",
] as const satisfies readonly BrandInsightsTabId[];

const MODULE_ID_SET = new Set<string>(BRAND_MODULE_IDS);
const INSIGHTS_TAB_ID_SET = new Set<string>(INSIGHTS_TAB_IDS);

const NON_INSIGHTS_MODULE_IDS = BRAND_MODULE_IDS.filter(
  (id) => id !== "insights"
);

export const DEFAULT_BRAND_MODULE: BrandModuleId = "insights";
export const DEFAULT_INSIGHTS_TAB: BrandInsightsTabId = "overview";

export type ParsedBrandRoute = {
  brandId: string;
  brandModule: BrandModuleId;
  brandInsightsTab: BrandInsightsTabId;
  isSettings?: boolean;
};

export function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase();
}

export function isValidBrandId(id: string): id is BrandId {
  return isKnownBrandId(id);
}

/** Prototype: allow dynamically created brand slugs on routed pages */
export function isRouteableBrandId(id: string): boolean {
  if (!id || id === "new") return false;
  return /^[a-z0-9-]+$/.test(id);
}

export function isValidBrandModuleId(id: string): id is BrandModuleId {
  return MODULE_ID_SET.has(id);
}

export function isValidBrandInsightsTabId(id: string): id is BrandInsightsTabId {
  return INSIGHTS_TAB_ID_SET.has(id);
}

export function isNonInsightsModule(
  module: BrandModuleId
): module is Exclude<BrandModuleId, "insights"> {
  return module !== "insights";
}

export function brandBasePath(brandId: string): string {
  return `/brands/${brandId}`;
}

export function brandInsightsPath(
  brandId: string,
  tab: BrandInsightsTabId = DEFAULT_INSIGHTS_TAB
): string {
  return `/brands/${brandId}/insights/${tab}`;
}

export function brandModulePath(
  brandId: string,
  module: Exclude<BrandModuleId, "insights">
): string {
  return `/brands/${brandId}/${module}`;
}

export function brandModuleOrInsightsPath(
  brandId: string,
  module: BrandModuleId,
  insightsTab: BrandInsightsTabId = DEFAULT_INSIGHTS_TAB
): string {
  if (module === "insights") {
    return brandInsightsPath(brandId, insightsTab);
  }
  return brandModulePath(brandId, module);
}

export function brandSettingsPath(brandId: string): string {
  return `/brands/${brandId}/settings`;
}

export function parseBrandPathname(pathname: string): ParsedBrandRoute | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "brands" || segments.length < 2) {
    return null;
  }

  if (segments[1] === "new") {
    return null;
  }

  const brandId = normalizeSlug(segments[1]);
  if (!isRouteableBrandId(brandId)) {
    return null;
  }

  if (segments.length === 2) {
    return {
      brandId,
      brandModule: DEFAULT_BRAND_MODULE,
      brandInsightsTab: DEFAULT_INSIGHTS_TAB,
    };
  }

  if (segments[2] === "settings") {
    return {
      brandId,
      brandModule: DEFAULT_BRAND_MODULE,
      brandInsightsTab: DEFAULT_INSIGHTS_TAB,
      isSettings: true,
    };
  }

  if (segments[2] === "insights") {
    const tabRaw = segments[3];
    if (!tabRaw) {
      return {
        brandId,
        brandModule: "insights",
        brandInsightsTab: DEFAULT_INSIGHTS_TAB,
      };
    }
    const tab = normalizeSlug(tabRaw);
    if (!isValidBrandInsightsTabId(tab)) {
      return null;
    }
    return { brandId, brandModule: "insights", brandInsightsTab: tab };
  }

  const brandModule = normalizeSlug(segments[2]);
  if (!isValidBrandModuleId(brandModule) || brandModule === "insights") {
    return null;
  }

  return {
    brandId,
    brandModule,
    brandInsightsTab: DEFAULT_INSIGHTS_TAB,
  };
}

export function getBrandIdsForStaticParams(): BrandId[] {
  return DOCK_BRANDS.map((b) => b.id);
}

export function getBrandModuleIdsForStaticParams(): Exclude<
  BrandModuleId,
  "insights"
>[] {
  return [...NON_INSIGHTS_MODULE_IDS];
}

export function getBrandInsightsTabIdsForStaticParams(): BrandInsightsTabId[] {
  return [...INSIGHTS_TAB_IDS];
}
