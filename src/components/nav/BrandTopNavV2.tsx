/** PROTOTYPE v2 brand top nav — Figma 2600:5298 */

"use client";

import Image from "next/image";
import { CaretLeft } from "@phosphor-icons/react";
import { DOCK_BRANDS } from "@/data/homeStatic";
import {
  type BrandTopNavTabV2,
  BRAND_TOP_NAV_TABS,
} from "@/data/brandStatic";
import { UserAvatar } from "./UserAvatar";

type BrandTopNavV2Props = {
  brandId: string;
  activeTab: BrandTopNavTabV2;
  onTabChange: (tab: BrandTopNavTabV2) => void;
  onBack: () => void;
};

export function BrandTopNavV2({
  brandId,
  activeTab,
  onTabChange,
  onBack,
}: BrandTopNavV2Props) {
  const brand = DOCK_BRANDS.find((b) => b.id === brandId);

  return (
    <header className="flex h-20 w-full shrink-0 items-center justify-between gap-4 px-4">
      <div className="flex min-w-0 shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to home"
          className="flex size-8 shrink-0 items-center justify-center rounded-rounded text-text-default transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <CaretLeft size={20} weight="bold" />
        </button>
        {brand && (
          <>
            <span className="relative size-8 shrink-0 overflow-hidden rounded-rounded">
              <Image
                src={brand.logoUrl}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </span>
            <span className="truncate text-base font-medium tracking-[-0.16px] text-text-default">
              {brand.name}
            </span>
          </>
        )}
      </div>

      <nav
        aria-label="Brand modules"
        className="flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto px-2"
      >
        {BRAND_TOP_NAV_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`shrink-0 rounded-rounded px-3 py-1.5 text-sm font-medium tracking-[-0.14px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
                isActive
                  ? "bg-white/10 text-text-default shadow-card"
                  : "text-text-subtle hover:bg-white/10 hover:text-text-default"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <UserAvatar size={32} />
    </header>
  );
}
