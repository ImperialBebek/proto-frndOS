/** PROTOTYPE brand top nav — Figma 2492:7228 */

"use client";

import type { ComponentType } from "react";
import {
  ChartPieSlice,
  PaintBrush,
  Microscope,
  ChartBar,
  Crown,
} from "@phosphor-icons/react";
import type { BrandModuleTab } from "@/data/brandStatic";
import { UserAvatar } from "./UserAvatar";

const TABS: {
  id: BrandModuleTab;
  label: string;
  icon: ComponentType<{ size?: number; weight?: "fill" | "regular" }>;
}[] = [
  { id: "insights", label: "Insights", icon: ChartPieSlice },
  { id: "studio", label: "Studio", icon: PaintBrush },
  { id: "research", label: "Research", icon: Microscope },
  { id: "growth", label: "Growth", icon: ChartBar },
  { id: "loyalty", label: "Loyalty", icon: Crown },
];

type BrandTopNavProps = {
  activeTab: BrandModuleTab;
  onTabChange: (tab: BrandModuleTab) => void;
};

export function BrandTopNav({ activeTab, onTabChange }: BrandTopNavProps) {
  return (
    <header className="flex w-full items-center justify-between px-6 py-4">
      <div className="size-8 shrink-0" aria-hidden />

      <nav
        aria-label="Brand modules"
        className="flex items-center rounded-rounded bg-white/0 p-1 backdrop-blur-shallow"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-pressed={isActive}
              className={`flex h-8 items-center gap-1.5 rounded-rounded px-3 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
                isActive
                  ? "bg-white shadow-card"
                  : "hover:bg-white/60"
              }`}
            >
              <span
                className={
                  isActive ? "text-primary-600" : "text-text-subtle"
                }
              >
                <Icon
                  size={20}
                  weight={isActive ? "fill" : "regular"}
                />
              </span>
              <span
                className={`text-sm font-medium tracking-[-0.14px] ${
                  isActive ? "text-primary-600" : "text-text-subtle"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      <UserAvatar size={32} />
    </header>
  );
}
