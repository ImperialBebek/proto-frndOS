import { DOCK_BRANDS } from "@/data/homeStatic";

const STATIC_BRAND_IDS = new Set<string>(DOCK_BRANDS.map((b) => b.id));
const dynamicBrandIds = new Set<string>();

export function registerDynamicBrandId(id: string): void {
  dynamicBrandIds.add(id);
}

export function unregisterDynamicBrandId(id: string): void {
  dynamicBrandIds.delete(id);
}

export function isKnownBrandId(id: string): boolean {
  return STATIC_BRAND_IDS.has(id) || dynamicBrandIds.has(id);
}
