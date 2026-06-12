/** PROTOTYPE v3 floating sidebar (rectangular mask reveal) — Figma 2608:7017 */

"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { TabId } from "@/data/homeStatic";
import type { Conversation } from "@/data/chatStatic";
import type { BrandModuleId, BrandInsightsTabId } from "@/data/navV3Static";
import type { UserBrand } from "@/data/brandAccessStatic";
import {
  prefersReducedMotion,
  v3FloatTiming,
  V3_FLOATING_SIDEBAR_WIDTH,
} from "@/lib/v3ShellMotion";
import { SidebarV3 } from "./SidebarV3";

const FLOAT_INSET = 8;
const MASK_RADIUS = 6;

export type AnchorRect = {
  top: number;
  left: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
};

type FloatingSidebarV3Props = {
  open: boolean;
  anchorRect: AnchorRect | null;
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
  onDock: () => void;
  quickAccessChats?: Conversation[];
  activeConversationId?: string | null;
  onChatSelect?: (id: string) => void;
  onChatSeeAll?: () => void;
  onChatNew?: () => void;
  onFooterSelect?: (id: string) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  activePitchId?: string | null;
  activePitchStepId?: string | null;
  onPitchStepSelect?: (stepId: string) => void;
  onBackToPitchList?: () => void;
};

type MaskOrigin = {
  ox: number;
  oy: number;
};

/** Pinhole clip collapsed to the icon center inside the mask box. */
function buildCenterOriginClip(
  origin: MaskOrigin,
  width: number,
  height: number,
  progress: number
): string {
  const p = Math.max(0, Math.min(1, progress));
  const top = origin.oy * p;
  const right = (width - origin.ox) * p;
  const bottom = (height - origin.oy) * p;
  const left = origin.ox * p;
  return `inset(${top}px ${right}px ${bottom}px ${left}px round ${MASK_RADIUS}px)`;
}

function getMaskOrigin(anchor: AnchorRect, shell: HTMLElement): MaskOrigin {
  const shellRect = shell.getBoundingClientRect();
  return {
    ox: anchor.centerX - shellRect.left,
    oy: anchor.centerY - shellRect.top,
  };
}

export function FloatingSidebarV3({
  open,
  anchorRect,
  activeTab,
  activeBrandId,
  brandModule,
  brandInsightsTab,
  onTabSelect,
  onBrandSelect,
  onBrandSettings,
  sidebarBrands,
  hasBrands,
  onBrandsSeeAll,
  onModuleSelect,
  onInsightsTabSelect,
  onBackToHome,
  onDock,
  quickAccessChats,
  activeConversationId,
  onChatSelect,
  onChatSeeAll,
  onChatNew,
  onFooterSelect,
  onPointerEnter,
  onPointerLeave,
  activePitchId = null,
  activePitchStepId = null,
  onPitchStepSelect,
  onBackToPitchList,
}: FloatingSidebarV3Props) {
  const shellRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prevOpenRef = useRef(false);

  useGSAP(
    () => {
      const shell = shellRef.current;
      const mask = maskRef.current;
      const content = contentRef.current;
      if (!shell || !mask || !content || !anchorRect) return;

      const reduce = prefersReducedMotion();
      const opening = open && !prevOpenRef.current;
      const { duration, ease } = v3FloatTiming(opening, reduce);
      const width = V3_FLOATING_SIDEBAR_WIDTH;

      gsap.set(shell, { autoAlpha: 1 });
      const height = mask.offsetHeight || content.offsetHeight;
      const origin = getMaskOrigin(anchorRect, shell);
      const clipState = { progress: open ? 1 : 0 };

      const applyClip = () => {
        mask.style.clipPath = buildCenterOriginClip(
          origin,
          width,
          height,
          clipState.progress
        );
      };

      if (reduce) {
        clipState.progress = open ? 0 : 1;
        applyClip();
        gsap.set(shell, { autoAlpha: open ? 1 : 0 });
      } else if (open) {
        clipState.progress = 1;
        applyClip();
        gsap.set(shell, { autoAlpha: 0 });

        gsap.to(clipState, {
          progress: 0,
          duration,
          ease,
          overwrite: "auto",
          onUpdate: applyClip,
        });
        gsap.to(shell, {
          autoAlpha: 1,
          duration,
          ease,
          overwrite: "auto",
        });
      } else {
        gsap.to(clipState, {
          progress: 1,
          duration,
          ease,
          overwrite: "auto",
          onUpdate: applyClip,
        });
        gsap.to(shell, {
          autoAlpha: 0,
          duration,
          ease,
          overwrite: "auto",
        });
      }

      prevOpenRef.current = open;
    },
    {
      dependencies: [
        open,
        anchorRect?.centerX,
        anchorRect?.centerY,
        activeTab,
        activePitchId,
        activeBrandId,
      ],
      revertOnUpdate: true,
    }
  );

  if (!anchorRect) return null;

  return (
    <div
      ref={shellRef}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      style={{
        position: "fixed",
        top: FLOAT_INSET,
        left: FLOAT_INSET,
        width: V3_FLOATING_SIDEBAR_WIDTH,
        maxHeight: `calc(100dvh - ${FLOAT_INSET * 2}px)`,
        opacity: 0,
        visibility: "hidden",
        zIndex: 50,
      }}
    >
      <div
        ref={maskRef}
        className="overflow-hidden rounded-md border border-line bg-card-bg shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)]"
      >
        <div
          ref={contentRef}
          className="flex max-h-[calc(100dvh-16px)] w-full flex-col overflow-hidden"
        >
          <SidebarV3
            floatingAnchor
            activeTab={activeTab}
            activeBrandId={activeBrandId}
            brandModule={brandModule}
            brandInsightsTab={brandInsightsTab}
            onTabSelect={onTabSelect}
            onBrandSelect={onBrandSelect}
            onBrandSettings={onBrandSettings}
            sidebarBrands={sidebarBrands}
            hasBrands={hasBrands}
            onBrandsSeeAll={onBrandsSeeAll}
            onModuleSelect={onModuleSelect}
            onInsightsTabSelect={onInsightsTabSelect}
            onBackToHome={onBackToHome}
            onCollapse={onDock}
            quickAccessChats={quickAccessChats}
            activeConversationId={activeConversationId}
            onChatSelect={onChatSelect}
            onChatSeeAll={onChatSeeAll}
            onChatNew={onChatNew}
            onFooterSelect={onFooterSelect}
            activePitchId={activePitchId}
            activePitchStepId={activePitchStepId}
            onPitchStepSelect={onPitchStepSelect}
            onBackToPitchList={onBackToPitchList}
          />
        </div>
      </div>
    </div>
  );
}
