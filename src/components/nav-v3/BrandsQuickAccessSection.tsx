/** PROTOTYPE v3 sidebar brands quick access — mirrors ChatQuickAccessSection */

"use client";

import { Gear } from "@phosphor-icons/react";
import type { UserBrand } from "@/data/brandAccessStatic";

const menuRowBase =
  "flex h-8 w-full items-center gap-2 rounded-sm px-2 text-sm font-medium tracking-[-0.14px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500";

type BrandsQuickAccessSectionProps = {
  brands: UserBrand[];
  activeBrandId: string | null;
  hasBrands: boolean;
  onBrandSelect: (brandId: string) => void;
  onBrandSettings?: (brandId: string) => void;
  onSeeAll?: () => void;
};

export function BrandsQuickAccessSection({
  brands,
  activeBrandId,
  hasBrands,
  onBrandSelect,
  onBrandSettings,
  onSeeAll,
}: BrandsQuickAccessSectionProps) {
  return (
    <div className="flex shrink-0 flex-col gap-2 p-4">
      <div className="group flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-text-inverse-subtle">Brands</p>
        {hasBrands && onSeeAll && (
          <button
            type="button"
            onClick={onSeeAll}
            className="pointer-events-none text-xs font-medium text-text-inverse-subtlest opacity-0 transition hover:text-text-inverse-subtle group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            See all
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {!hasBrands ? (
          <p className="px-2 py-1 text-xs text-text-inverse-subtlest">
            No brands yet
          </p>
        ) : (
          brands.map((brand) => {
            const isActive = activeBrandId === brand.id;
            return (
              <BrandRow
                key={brand.id}
                name={brand.name}
                isActive={isActive}
                onSelect={() => onBrandSelect(brand.id)}
                onSettings={
                  onBrandSettings
                    ? () => onBrandSettings(brand.id)
                    : undefined
                }
              />
            );
          })
        )}
      </div>
    </div>
  );
}

function BrandRow({
  name,
  isActive,
  onSelect,
  onSettings,
}: {
  name: string;
  isActive: boolean;
  onSelect: () => void;
  onSettings?: () => void;
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        onClick={onSelect}
        className={`${menuRowBase} ${
          isActive
            ? "bg-[var(--nav-active)] text-text-inverse"
            : "text-text-inverse-subtle hover:bg-[var(--nav-hover)] hover:text-text-inverse"
        } ${onSettings ? "pr-8" : ""}`}
      >
        <BrandMark name={name} />
        <span className="truncate">{name}</span>
      </button>
      {onSettings && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSettings();
          }}
          aria-label={`${name} settings`}
          className="absolute right-1 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-xs text-text-inverse-subtle opacity-0 transition hover:bg-white/[0.08] hover:text-text-inverse group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <Gear size={16} />
        </button>
      )}
    </div>
  );
}

function BrandMark({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-rounded border border-white/20 bg-white text-[9px] font-semibold tracking-[-0.2px] text-black">
      {initials}
    </span>
  );
}
