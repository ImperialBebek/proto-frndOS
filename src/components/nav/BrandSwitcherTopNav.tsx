/** PROTOTYPE v2 top brand switcher — Figma 2537:14185 / 2537:15050 */

"use client";

import Image from "next/image";
import { House } from "@phosphor-icons/react";
import { DOCK_BRANDS } from "@/data/homeStatic";
import { UserAvatar } from "./UserAvatar";

type BrandSwitcherTopNavProps = {
  activeBrandId: string | null;
  onHomeSelect: () => void;
  onBrandSelect: (brandId: string) => void;
  compact?: boolean;
};

export function BrandSwitcherTopNav({
  activeBrandId,
  onHomeSelect,
  onBrandSelect,
  compact = false,
}: BrandSwitcherTopNavProps) {
  const homeActive = activeBrandId === null;

  return (
    <header
      className={`flex w-full shrink-0 items-center justify-between ${
        compact ? "px-4 py-2" : "p-4"
      }`}
    >
      <nav
        aria-label="Brand switcher"
        className="flex items-center gap-0 rounded-rounded backdrop-blur-shallow"
      >
        <button
          type="button"
          onClick={onHomeSelect}
          aria-pressed={homeActive}
          aria-label="Home"
          className={`flex h-8 items-center justify-center gap-1.5 rounded-rounded px-3 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
            homeActive
              ? "bg-white shadow-card"
              : "hover:bg-white/60"
          }`}
        >
          <House
            size={20}
            weight={homeActive ? "fill" : "regular"}
            className={homeActive ? "text-primary-500" : "text-text-subtle"}
          />
        </button>

        {DOCK_BRANDS.map((brand) => {
          const isActive = activeBrandId === brand.id;
          return (
            <button
              key={brand.id}
              type="button"
              onClick={() => onBrandSelect(brand.id)}
              aria-pressed={isActive}
              className={`flex h-8 items-center gap-1.5 rounded-rounded px-3 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
                isActive
                  ? "bg-white shadow-card"
                  : "hover:bg-white/60"
              }`}
            >
              <span className="relative size-5 shrink-0 overflow-hidden rounded-xs">
                <Image
                  src={brand.logoUrl}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </span>
              <span
                className={`text-sm font-medium tracking-[-0.14px] ${
                  isActive ? "text-text-default" : "text-text-subtle"
                }`}
              >
                {brand.name}
              </span>
            </button>
          );
        })}
      </nav>

      <UserAvatar size={32} />
    </header>
  );
}
