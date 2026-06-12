/** PROTOTYPE v2 top brand switcher — Figma 2600:5375 */

"use client";

import Image from "next/image";
import { House, SquaresFour } from "@phosphor-icons/react";
import { DOCK_BRANDS } from "@/data/homeStatic";
import { UserAvatar } from "./UserAvatar";

type BrandSwitcherTopNavProps = {
  activeBrandId: string | null;
  onHomeSelect: () => void;
  onBrandSelect: (brandId: string) => void;
};

const tabBase =
  "flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-rounded px-3 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500";

const tabActive = "bg-white/10 text-text-default shadow-card";
const tabInactive =
  "text-text-subtle hover:bg-white/10 hover:text-text-default";

export function BrandSwitcherTopNav({
  activeBrandId,
  onHomeSelect,
  onBrandSelect,
}: BrandSwitcherTopNavProps) {
  const homeActive = activeBrandId === null;

  return (
    <header className="flex w-full shrink-0 items-center justify-between p-4">
      <nav
        aria-label="Brand switcher"
        className="flex items-center gap-0 rounded-rounded"
      >
        <button
          type="button"
          onClick={onHomeSelect}
          aria-pressed={homeActive}
          aria-label="Home"
          className={`${tabBase} ${homeActive ? tabActive : tabInactive}`}
        >
          <House
            size={16}
            weight={homeActive ? "fill" : "regular"}
            className="shrink-0"
          />
          {homeActive && (
            <span className="text-xs font-medium tracking-[0px]">Home</span>
          )}
        </button>

        {DOCK_BRANDS.map((brand) => {
          const isActive = activeBrandId === brand.id;
          return (
            <button
              key={brand.id}
              type="button"
              onClick={() => onBrandSelect(brand.id)}
              aria-pressed={isActive}
              aria-label={brand.name}
              className={`${tabBase} ${isActive ? tabActive : tabInactive}`}
            >
              <span className="relative size-5 shrink-0 overflow-hidden rounded-rounded">
                <Image
                  src={brand.logoUrl}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </span>
              {isActive && (
                <span className="text-xs font-medium tracking-[0px]">
                  {brand.name}
                </span>
              )}
            </button>
          );
        })}

        <button
          type="button"
          aria-label="All brands"
          className={`${tabBase} ${tabInactive}`}
        >
          <SquaresFour size={20} weight="regular" className="shrink-0" />
        </button>
      </nav>

      <UserAvatar size={32} />
    </header>
  );
}
