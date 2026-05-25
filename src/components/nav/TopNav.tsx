/** PROTOTYPE top nav — Figma 2532:14181 */

"use client";

import {
  House,
  Tray,
  Funnel,
} from "@phosphor-icons/react";
import type { TabId } from "@/data/homeStatic";
import { UserAvatar } from "./UserAvatar";

type TopNavProps = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
};

function NavDivider() {
  return <div className="h-6 w-px shrink-0 bg-grey-100" aria-hidden />;
}

export function TopNav({ activeTab, onTabChange }: TopNavProps) {
  const homeActive = activeTab === "home";

  return (
    <header className="sticky top-0 z-[3] flex w-full items-center justify-between p-4">
      <div className="size-8 shrink-0" aria-hidden />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onTabChange("home")}
          aria-pressed={homeActive}
          aria-label="Home"
          className={`flex h-8 items-center justify-center gap-1.5 rounded-rounded px-3 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
            homeActive
              ? "bg-white shadow-card"
              : "bg-transparent hover:bg-white/60"
          }`}
        >
          <House
            size={20}
            weight={homeActive ? "fill" : "regular"}
            className={homeActive ? "text-primary-500" : "text-text-subtle"}
          />
        </button>

        <NavDivider />

        <div className="flex items-center rounded-rounded backdrop-blur-shallow">
          <button
            type="button"
            onClick={() => onTabChange("inbox")}
            aria-pressed={activeTab === "inbox"}
            className={`flex h-8 items-center justify-center gap-1.5 rounded-rounded px-3 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
              activeTab === "inbox"
                ? "bg-white shadow-card"
                : "hover:bg-white/60"
            }`}
          >
            <Tray
              size={20}
              weight={activeTab === "inbox" ? "fill" : "regular"}
              className={
                activeTab === "inbox" ? "text-primary-500" : "text-text-subtle"
              }
            />
            <span
              className={`text-sm font-medium tracking-[-0.14px] ${
                activeTab === "inbox" ? "text-text-default" : "text-text-subtle"
              }`}
            >
              Inbox
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("playground")}
            aria-pressed={activeTab === "playground"}
            className={`flex h-8 items-center justify-center gap-1.5 rounded-rounded px-3 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
              activeTab === "playground"
                ? "bg-white shadow-card"
                : "hover:bg-white/60"
            }`}
          >
            <Funnel
              size={20}
              weight={activeTab === "playground" ? "fill" : "regular"}
              className={
                activeTab === "playground"
                  ? "text-primary-500"
                  : "text-text-subtle"
              }
            />
            <span
              className={`text-sm font-medium tracking-[-0.14px] ${
                activeTab === "playground"
                  ? "text-text-default"
                  : "text-text-subtle"
              }`}
            >
              Playground
            </span>
          </button>
        </div>
      </div>

      <UserAvatar size={32} />
    </header>
  );
}
