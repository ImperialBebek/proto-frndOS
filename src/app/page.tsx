/** PROTOTYPE — v1: Figma 2487:5908 + 2492:6699 | v2: 2537:14183 */

"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { DockTransition } from "@/components/nav/DockTransition";
import { DockTransitionV2 } from "@/components/nav/DockTransitionV2";
import { ToolDockControls } from "@/components/nav/ToolDockControls";
import { ModuleDockControls } from "@/components/nav/ModuleDockControls";
import { BrandSwitcherTopNav } from "@/components/nav/BrandSwitcherTopNav";
import { VariantSwitcher } from "@/components/nav/VariantSwitcher";
import { HomePageContent } from "@/components/home/HomePageContent";
import { HomePageContentV2 } from "@/components/home/HomePageContentV2";
import { BrandPage } from "@/components/brand/BrandPage";
import { BrandPageV2 } from "@/components/brand/BrandPageV2";
import type { TabId } from "@/data/homeStatic";
import type { BrandModuleTab } from "@/data/brandStatic";
import { parseNavVariant, type ToolDockId } from "@/data/navV2Static";

function HomePrototypePageV1() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null);
  const showBrand = activeBrandId !== null;

  return (
    <>
      {showBrand ? (
        <BrandPage brandId={activeBrandId} />
      ) : (
        <AppShell topNav={null} bottomNav={null}>
          <HomePageContent
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onBrandSelect={setActiveBrandId}
          />
        </AppShell>
      )}

      <DockTransition
        showBrand={showBrand}
        activeBrandId={activeBrandId}
        onHomeClick={() => setActiveBrandId(null)}
        onBrandClick={setActiveBrandId}
      />
    </>
  );
}

function HomePrototypePageV2() {
  const [activeBrandId, setActiveBrandId] = useState<string | null>(null);
  const [activeModuleTab, setActiveModuleTab] =
    useState<BrandModuleTab>("insights");
  const [activeToolId, setActiveToolId] = useState<ToolDockId>("ask-frnd");
  const showBrand = activeBrandId !== null;

  return (
    <>
      {showBrand ? (
        <div className="flex h-dvh min-w-[1440px] flex-col overflow-hidden bg-grey-100">
          <BrandSwitcherTopNav
            activeBrandId={activeBrandId}
            onHomeSelect={() => setActiveBrandId(null)}
            onBrandSelect={setActiveBrandId}
            compact
          />
          <BrandPageV2 brandId={activeBrandId} />
          <div className="h-12 shrink-0" aria-hidden />
        </div>
      ) : (
        <AppShell
          topNav={
            <BrandSwitcherTopNav
              activeBrandId={activeBrandId}
              onHomeSelect={() => setActiveBrandId(null)}
              onBrandSelect={setActiveBrandId}
            />
          }
          bottomNav={null}
        >
          <HomePageContentV2 />
        </AppShell>
      )}

      <DockTransitionV2
        showBrand={showBrand}
        navLabel={showBrand ? "Brand modules" : "Tools"}
      >
        {showBrand ? (
          <ModuleDockControls
            variant="sticky"
            activeTab={activeModuleTab}
            onTabChange={setActiveModuleTab}
          />
        ) : (
          <ToolDockControls
            variant="floating"
            activeToolId={activeToolId}
            onToolChange={setActiveToolId}
          />
        )}
      </DockTransitionV2>
    </>
  );
}

function HomePrototypePageInner() {
  const searchParams = useSearchParams();
  const variant = parseNavVariant(searchParams.get("variant"));

  return (
    <>
      <VariantSwitcher />
      {variant === "v2" ? <HomePrototypePageV2 /> : <HomePrototypePageV1 />}
    </>
  );
}

export default function HomePrototypePage() {
  return (
    <Suspense fallback={null}>
      <HomePrototypePageInner />
    </Suspense>
  );
}
