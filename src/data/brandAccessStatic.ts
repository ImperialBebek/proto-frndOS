/** PROTOTYPE brand access — membership, invites, industries */

import { DOCK_BRANDS } from "./homeStatic";

export type BrandMembershipRole = "owner" | "member";

export type UserBrand = {
  id: string;
  name: string;
  logoUrl: string;
  industry?: string;
  role: BrandMembershipRole;
};

export type PendingBrandInvite = {
  id: string;
  brandName: string;
  brandLogoUrl: string;
  invitedBy: string;
  role: string;
  sentAt: string;
};

export const BRAND_INDUSTRY_OPTIONS = [
  "FMCG",
  "Finance",
  "Technology",
  "Retail",
  "Healthcare",
  "Automotive",
  "Other",
] as const;

export type BrandIndustry = (typeof BRAND_INDUSTRY_OPTIONS)[number];

/** Default prototype: user owns/joins sidebar brands */
export function getDefaultUserBrands(): UserBrand[] {
  return [
    { ...DOCK_BRANDS[0], industry: "FMCG", role: "owner" },
    { ...DOCK_BRANDS[2], industry: "Finance", role: "owner" },
    { ...DOCK_BRANDS[3], industry: "Technology", role: "member" },
    { ...DOCK_BRANDS[4], industry: "Technology", role: "member" },
  ];
}

/** Demo invites — empty in default flow; use ?prototype=pending-invites */
export const PROTOTYPE_PENDING_INVITES: PendingBrandInvite[] = [
  {
    id: "invite-aqua",
    brandName: "Aqua Indonesia",
    brandLogoUrl: DOCK_BRANDS[1].logoUrl,
    invitedBy: "Sabrina Wijaya",
    role: "Editor",
    sentAt: "2h ago",
  },
];

export const SIDEBAR_BRAND_PREVIEW_LIMIT = 4;

export function slugifyBrandName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}
