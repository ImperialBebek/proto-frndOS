/** PROTOTYPE v3 sidebar — Figma Navigation 12002:4244 */

"use client";

import { useState } from "react";
import {
  SidebarSimple,
  CaretDown,
  ArrowLeft,
} from "@phosphor-icons/react";
import type { TabId } from "@/data/homeStatic";
import { useBrands } from "@/context/BrandsProvider";
import type { Conversation } from "@/data/chatStatic";
import {
  V3_PRIMARY_NAV,
  V3_FOOTER_NAV,
  V3_BRAND_FOOTER_NAV,
  V3_BRAND_MODULES,
  type BrandModuleId,
  type BrandInsightsTabId,
} from "@/data/navV3Static";
import type { UserBrand } from "@/data/brandAccessStatic";
import { FrndLogo } from "./FrndLogo";
import { ShellTopBarV3 } from "./ShellTopBarV3";
import { PitchPipelineSidebarBody } from "./pitch/PitchPipelineSidebar";
import { ChatQuickAccessSection } from "./ChatQuickAccessSection";
import { BrandsQuickAccessSection } from "./BrandsQuickAccessSection";

type SidebarV3Props = {
  activeTab: TabId;
  activeBrandId: string | null;
  brandModule: BrandModuleId;
  brandInsightsTab: BrandInsightsTabId;
  onTabSelect: (tab: TabId) => void;
  onBrandSelect: (brandId: string) => void;
  onBrandSettings?: (brandId: string) => void;
  sidebarBrands?: UserBrand[];
  hasBrands?: boolean;
  onBrandsSeeAll?: () => void;
  onModuleSelect: (module: BrandModuleId) => void;
  onInsightsTabSelect: (tab: BrandInsightsTabId) => void;
  onBackToHome: () => void;
  onCollapse: () => void;
  quickAccessChats?: Conversation[];
  activeConversationId?: string | null;
  onChatSelect?: (id: string) => void;
  onChatSeeAll?: () => void;
  onChatNew?: () => void;
  onFooterSelect?: (id: string) => void;
  /** When set, the sidebar renders the pitch pipeline for this pitch session */
  activePitchId?: string | null;
  activePitchStepId?: string | null;
  onPitchStepSelect?: (stepId: string) => void;
  onBackToPitchList?: () => void;
  /** When true, header shows only collapse icon (floating anchor mode) */
  floatingAnchor?: boolean;
};

/** Primary nav rows — Figma gap 12px between icon and label */
const navRowBase =
  "flex h-8 w-full items-center gap-3 rounded-sm px-2 text-sm font-medium tracking-[-0.14px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500";

/** Brand / chat / footer rows — Figma gap 8px between icon and label */
const menuRowBase =
  "flex h-8 w-full items-center gap-2 rounded-sm px-2 text-sm font-medium tracking-[-0.14px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500";

const subRowBase =
  "flex h-8 w-full items-center rounded-sm pl-9 pr-2 text-sm font-medium tracking-[-0.14px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500";

export function SidebarV3({
  activeTab,
  activeBrandId,
  brandModule,
  brandInsightsTab,
  onTabSelect,
  onBrandSelect,
  onBrandSettings,
  sidebarBrands = [],
  hasBrands = true,
  onBrandsSeeAll,
  onModuleSelect,
  onInsightsTabSelect,
  onBackToHome,
  onCollapse,
  quickAccessChats = [],
  activeConversationId = null,
  onChatSelect,
  onChatSeeAll,
  onChatNew,
  onFooterSelect,
  activePitchId = null,
  activePitchStepId = null,
  onPitchStepSelect,
  onBackToPitchList,
  floatingAnchor = false,
}: SidebarV3Props) {
  const { userBrands } = useBrands();
  const isPitchSession = activePitchId !== null;
  const isBrand = !isPitchSession && activeBrandId !== null;
  const brand = isBrand
    ? userBrands.find((b) => b.id === activeBrandId)
    : null;
  const [insightsExpanded, setInsightsExpanded] = useState(true);

  const showChatQuickAccess =
    !isPitchSession &&
    Boolean(onChatSelect && onChatSeeAll && onChatNew);

  return (
    <div className="flex h-full w-full flex-col">
      <ShellTopBarV3 variant="sidebar">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onCollapse}
            aria-label="Collapse sidebar"
            className="flex size-8 shrink-0 items-center justify-center rounded-xs text-text-inverse-subtle transition-colors hover:bg-white/[0.06] hover:text-text-inverse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            <SidebarSimple size={24} />
          </button>
          {floatingAnchor || !isBrand ? (
            <FrndLogo />
          ) : (
            brand && (
              <div className="flex min-w-0 items-center gap-2">
                <BrandMark name={brand.name} />
                <span className="truncate text-base font-medium tracking-[-0.16px] text-text-inverse">
                  {brand.name}
                </span>
              </div>
            )
          )}
        </div>
      </ShellTopBarV3>

      {isPitchSession ? (
        <PitchPipelineSidebarBody
          pitchId={activePitchId}
          activeStepId={activePitchStepId}
          onStepSelect={(stepId) => onPitchStepSelect?.(stepId)}
          onBackToPitchList={() => onBackToPitchList?.()}
        />
      ) : isBrand ? (
        <BrandSidebarBody
          brandModule={brandModule}
          brandInsightsTab={brandInsightsTab}
          insightsExpanded={insightsExpanded}
          onInsightsExpandedChange={setInsightsExpanded}
          onBackToHome={onBackToHome}
          onModuleSelect={onModuleSelect}
          onInsightsTabSelect={onInsightsTabSelect}
          showChatQuickAccess={showChatQuickAccess}
          quickAccessChats={quickAccessChats}
          activeConversationId={activeConversationId}
          onChatSelect={onChatSelect}
          onChatSeeAll={onChatSeeAll}
          onChatNew={onChatNew}
          onFooterSelect={onFooterSelect}
        />
      ) : (
        <HomeSidebarBody
          activeTab={activeTab}
          onTabSelect={onTabSelect}
          onBrandSelect={onBrandSelect}
          onBrandSettings={onBrandSettings}
          activeBrandId={activeBrandId}
          sidebarBrands={sidebarBrands}
          hasBrands={hasBrands}
          onBrandsSeeAll={onBrandsSeeAll}
          showChatQuickAccess={showChatQuickAccess}
          quickAccessChats={quickAccessChats}
          activeConversationId={activeConversationId}
          onChatSelect={onChatSelect}
          onChatSeeAll={onChatSeeAll}
          onChatNew={onChatNew}
        />
      )}
    </div>
  );
}

function HomeSidebarBody({
  activeTab,
  onTabSelect,
  onBrandSelect,
  onBrandSettings,
  activeBrandId,
  sidebarBrands,
  hasBrands,
  onBrandsSeeAll,
  showChatQuickAccess,
  quickAccessChats,
  activeConversationId,
  onChatSelect,
  onChatSeeAll,
  onChatNew,
}: {
  activeTab: TabId;
  onTabSelect: (tab: TabId) => void;
  onBrandSelect: (brandId: string) => void;
  onBrandSettings?: (brandId: string) => void;
  activeBrandId: string | null;
  sidebarBrands: UserBrand[];
  hasBrands: boolean;
  onBrandsSeeAll?: () => void;
  showChatQuickAccess: boolean;
  quickAccessChats: Conversation[];
  activeConversationId: string | null;
  onChatSelect?: (id: string) => void;
  onChatSeeAll?: () => void;
  onChatNew?: () => void;
}) {
  return (
    <>
      <nav aria-label="Primary" className="flex shrink-0 flex-col gap-1 p-4">
        {V3_PRIMARY_NAV.map((item) => {
          const isTab = item.id !== "search";
          const isActive = activeBrandId === null && isTab && activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.id !== "search") onTabSelect(item.id);
              }}
              aria-current={isActive ? "page" : undefined}
              className={`${navRowBase} ${
                isActive
                  ? "bg-[var(--nav-active)] text-text-inverse"
                  : "text-text-inverse-subtle hover:bg-[var(--nav-hover)] hover:text-text-inverse"
              }`}
            >
              <Icon
                size={20}
                weight={isActive ? "fill" : "regular"}
                className="shrink-0"
              />
              <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
              {item.shortcut && (
                <span className="flex shrink-0 items-center gap-1">
                  {item.shortcut.map((key) => (
                    <kbd
                      key={key}
                      className="flex h-5 min-w-5 items-center justify-center rounded-xs bg-white/[0.08] px-1 text-[11px] font-medium text-text-inverse-subtle"
                    >
                      {key}
                    </kbd>
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <BrandsQuickAccessSection
        brands={sidebarBrands}
        activeBrandId={activeBrandId}
        hasBrands={hasBrands}
        onBrandSelect={onBrandSelect}
        onBrandSettings={onBrandSettings}
        onSeeAll={onBrandsSeeAll}
      />

      {showChatQuickAccess && onChatSelect && onChatSeeAll && onChatNew && (
        <ChatQuickAccessSection
          conversations={quickAccessChats}
          activeConversationId={activeConversationId}
          onSelect={onChatSelect}
          onSeeAll={onChatSeeAll}
          onNewChat={onChatNew}
        />
      )}
    </>
  );
}

function BrandSidebarBody({
  brandModule,
  brandInsightsTab,
  insightsExpanded,
  onInsightsExpandedChange,
  onBackToHome,
  onModuleSelect,
  onInsightsTabSelect,
  showChatQuickAccess,
  quickAccessChats,
  activeConversationId,
  onChatSelect,
  onChatSeeAll,
  onChatNew,
  onFooterSelect,
}: {
  brandModule: BrandModuleId;
  brandInsightsTab: BrandInsightsTabId;
  insightsExpanded: boolean;
  onInsightsExpandedChange: (open: boolean) => void;
  onBackToHome: () => void;
  onModuleSelect: (module: BrandModuleId) => void;
  onInsightsTabSelect: (tab: BrandInsightsTabId) => void;
  showChatQuickAccess: boolean;
  quickAccessChats: Conversation[];
  activeConversationId: string | null;
  onChatSelect?: (id: string) => void;
  onChatSeeAll?: () => void;
  onChatNew?: () => void;
  onFooterSelect?: (id: string) => void;
}) {
  return (
    <>
      <div className="shrink-0 p-4 pb-0">
        <button
          type="button"
          onClick={onBackToHome}
          className={`${menuRowBase} text-text-inverse-subtle hover:bg-white/[0.03] hover:text-text-inverse`}
        >
          <ArrowLeft size={20} className="shrink-0" />
          Back to Home
        </button>
      </div>

      <nav
        aria-label="Brand modules"
        className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-4 pt-2"
      >
        {V3_BRAND_MODULES.map((mod) => {
          const Icon = mod.icon;
          const hasSubs = mod.subTabs && mod.subTabs.length > 0;
          const isInsights = mod.id === "insights";
          const isModuleActive = brandModule === mod.id;

          if (hasSubs && isInsights) {
            return (
              <div key={mod.id} className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => {
                    onModuleSelect("insights");
                    onInsightsExpandedChange(!insightsExpanded);
                  }}
                  aria-expanded={insightsExpanded}
                  className={`${menuRowBase} ${
                    isModuleActive
                      ? "text-text-inverse"
                      : "text-text-inverse-subtle hover:bg-white/[0.03] hover:text-text-inverse"
                  }`}
                >
                  <Icon size={20} className="shrink-0" />
                  <span className="min-w-0 flex-1 truncate text-left">
                    {mod.label}
                  </span>
                  <CaretDown
                    size={14}
                    className={`shrink-0 text-text-inverse-subtle transition-transform ${
                      insightsExpanded ? "rotate-0" : "-rotate-90"
                    }`}
                    aria-hidden
                  />
                </button>
                {insightsExpanded &&
                  mod.subTabs!.map((sub) => {
                    const isSubActive =
                      brandModule === "insights" &&
                      brandInsightsTab === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          onModuleSelect("insights");
                          onInsightsTabSelect(sub.id);
                        }}
                        aria-current={isSubActive ? "page" : undefined}
                        className={`${subRowBase} ${
                          isSubActive
                            ? "bg-[var(--nav-active)] text-text-inverse"
                            : "text-text-inverse-subtle hover:bg-white/[0.03] hover:text-text-inverse"
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
              </div>
            );
          }

          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => onModuleSelect(mod.id)}
              aria-current={isModuleActive ? "page" : undefined}
              className={`${menuRowBase} ${
                isModuleActive
                  ? "bg-[var(--nav-active)] text-text-inverse"
                  : "text-text-inverse-subtle hover:bg-white/[0.03] hover:text-text-inverse"
              }`}
            >
              <Icon size={20} className="shrink-0" />
              {mod.label}
            </button>
          );
        })}
      </nav>

      {showChatQuickAccess && onChatSelect && onChatSeeAll && onChatNew && (
        <ChatQuickAccessSection
          conversations={quickAccessChats}
          activeConversationId={activeConversationId}
          onSelect={onChatSelect}
          onSeeAll={onChatSeeAll}
          onNewChat={onChatNew}
        />
      )}

      <SidebarFooter items={V3_BRAND_FOOTER_NAV} onSelect={onFooterSelect} />
    </>
  );
}

function SidebarFooter({
  items,
  onSelect,
}: {
  items: typeof V3_FOOTER_NAV;
  onSelect?: (id: string) => void;
}) {
  return (
    <div className="flex shrink-0 flex-col gap-1 p-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect?.(item.id)}
            className={`${menuRowBase} text-text-inverse-subtle hover:bg-white/[0.03] hover:text-text-inverse`}
          >
            <Icon size={20} className="shrink-0" />
            {item.label}
          </button>
        );
      })}
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
