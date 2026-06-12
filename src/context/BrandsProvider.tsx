"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getDefaultUserBrands,
  PROTOTYPE_PENDING_INVITES,
  SIDEBAR_BRAND_PREVIEW_LIMIT,
  slugifyBrandName,
  type BrandIndustry,
  type PendingBrandInvite,
  type UserBrand,
} from "@/data/brandAccessStatic";
import { registerDynamicBrandId } from "@/lib/brandRegistry";

export type PrototypeBrandMode = "default" | "zero-brands" | "pending-invites";

type CreateBrandInput = {
  name: string;
  industry: BrandIndustry;
  logoUrl?: string;
};

type BrandsContextValue = {
  userBrands: UserBrand[];
  pendingInvites: PendingBrandInvite[];
  sidebarBrands: UserBrand[];
  hasBrands: boolean;
  newBrandIds: Set<string>;
  acceptInvite: (inviteId: string) => void;
  declineInvite: (inviteId: string) => void;
  createBrand: (input: CreateBrandInput) => UserBrand;
  isNewBrand: (brandId: string) => boolean;
  clearNewBrandFlag: (brandId: string) => void;
};

const BrandsContext = createContext<BrandsContextValue | null>(null);

function resolveInitialState(mode: PrototypeBrandMode): {
  brands: UserBrand[];
  invites: PendingBrandInvite[];
} {
  if (mode === "zero-brands") {
    return { brands: [], invites: [] };
  }
  if (mode === "pending-invites") {
    return { brands: [], invites: [...PROTOTYPE_PENDING_INVITES] };
  }
  return { brands: getDefaultUserBrands(), invites: [] };
}

function readPrototypeMode(): PrototypeBrandMode {
  if (typeof window === "undefined") return "default";
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("prototype");
  if (mode === "zero-brands" || mode === "pending-invites") return mode;
  return "default";
}

export function BrandsProvider({ children }: { children: ReactNode }) {
  const [prototypeMode] = useState<PrototypeBrandMode>(readPrototypeMode);
  const initial = useMemo(() => resolveInitialState(prototypeMode), [prototypeMode]);

  const [userBrands, setUserBrands] = useState<UserBrand[]>(initial.brands);
  const [pendingInvites, setPendingInvites] = useState<PendingBrandInvite[]>(
    initial.invites
  );
  const [newBrandIds, setNewBrandIds] = useState<Set<string>>(new Set());

  const sidebarBrands = useMemo(
    () => userBrands.slice(0, SIDEBAR_BRAND_PREVIEW_LIMIT),
    [userBrands]
  );

  const acceptInvite = useCallback((inviteId: string) => {
    setPendingInvites((prev) => {
      const invite = prev.find((item) => item.id === inviteId);
      if (!invite) return prev;

      const brandId = slugifyBrandName(invite.brandName);
      registerDynamicBrandId(brandId);
      setUserBrands((brands) => {
        if (brands.some((b) => b.id === brandId)) return brands;
        return [
          ...brands,
          {
            id: brandId,
            name: invite.brandName,
            logoUrl: invite.brandLogoUrl,
            role: "member",
          },
        ];
      });

      return prev.filter((item) => item.id !== inviteId);
    });
  }, []);

  const declineInvite = useCallback((inviteId: string) => {
    setPendingInvites((prev) => prev.filter((item) => item.id !== inviteId));
  }, []);

  const createBrand = useCallback((input: CreateBrandInput) => {
    const baseId = slugifyBrandName(input.name) || "new-brand";
    let brandId = baseId;
    let suffix = 1;
    while (userBrands.some((b) => b.id === brandId)) {
      brandId = `${baseId}-${suffix}`;
      suffix += 1;
    }

    const brand: UserBrand = {
      id: brandId,
      name: input.name.trim(),
      logoUrl:
        input.logoUrl ??
        "https://www.figma.com/api/mcp/asset/fa07916c-3a70-4d42-b8b2-4f7d5a97f2ee",
      industry: input.industry,
      role: "owner",
    };

    registerDynamicBrandId(brandId);
    setUserBrands((prev) => [...prev, brand]);
    setNewBrandIds((prev) => new Set(prev).add(brandId));
    return brand;
  }, [userBrands]);

  const isNewBrand = useCallback(
    (brandId: string) => newBrandIds.has(brandId),
    [newBrandIds]
  );

  const clearNewBrandFlag = useCallback((brandId: string) => {
    setNewBrandIds((prev) => {
      if (!prev.has(brandId)) return prev;
      const next = new Set(prev);
      next.delete(brandId);
      return next;
    });
  }, []);

  const value = useMemo<BrandsContextValue>(
    () => ({
      userBrands,
      pendingInvites,
      sidebarBrands,
      hasBrands: userBrands.length > 0,
      newBrandIds,
      acceptInvite,
      declineInvite,
      createBrand,
      isNewBrand,
      clearNewBrandFlag,
    }),
    [
      userBrands,
      pendingInvites,
      sidebarBrands,
      newBrandIds,
      acceptInvite,
      declineInvite,
      createBrand,
      isNewBrand,
      clearNewBrandFlag,
    ]
  );

  return (
    <BrandsContext.Provider value={value}>{children}</BrandsContext.Provider>
  );
}

export function useBrands(): BrandsContextValue {
  const ctx = useContext(BrandsContext);
  if (!ctx) {
    throw new Error("useBrands must be used within BrandsProvider");
  }
  return ctx;
}
