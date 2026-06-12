/** PROTOTYPE v2 brand module dock — Figma 2537:15106 */

"use client";

import type { ComponentType } from "react";
import {
  ChartPieSlice,
  PaintBrush,
  Microscope,
  TrendUp,
  CrownSimple,
} from "@phosphor-icons/react";
import type { BrandModuleTab } from "@/data/brandStatic";
import type { DockVariant } from "./BottomDock";

const MODULE_TABS: {
  id: BrandModuleTab;
  label: string;
  icon: ComponentType<{ size?: number; weight?: "fill" | "regular" }>;
}[] = [
  { id: "insights", label: "Insights", icon: ChartPieSlice },
  { id: "studio", label: "Studio", icon: PaintBrush },
  { id: "research", label: "Research", icon: Microscope },
  { id: "growth", label: "Growth", icon: TrendUp },
  { id: "loyalty", label: "Loyalty", icon: CrownSimple },
];

export type ModuleDockControlsProps = {
  variant: DockVariant;
  activeTab: BrandModuleTab;
  onTabChange: (tab: BrandModuleTab) => void;
};

export function ModuleDockControls({
  variant,
  activeTab,
  onTabChange,
}: ModuleDockControlsProps) {
  const isSticky = variant === "sticky";

  return (
    <>
      {MODULE_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            aria-pressed={isActive}
            aria-label={tab.label}
            className={`flex shrink-0 items-center justify-center rounded-sm transition-[width,height,background-color] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
              isSticky ? "size-8" : "size-10"
            } ${
              isActive
                ? "bg-primary-600 text-white"
                : "bg-[var(--container-input)] text-text-subtle hover:bg-white/10"
            }`}
          >
            <Icon
              size={isSticky ? 16 : 24}
              weight={isActive ? "fill" : "regular"}
            />
          </button>
        );
      })}
    </>
  );
}
