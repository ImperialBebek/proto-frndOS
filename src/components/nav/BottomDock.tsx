/** PROTOTYPE dock — Home floating 2487:5918 / Brand sticky 2492:6706 */

"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { House } from "@phosphor-icons/react";
import { DOCK_BRANDS } from "@/data/homeStatic";

export type DockVariant = "floating" | "sticky";

export type DockControlsProps = {
  activeBrandId: string | null;
  variant: DockVariant;
  onHomeClick: () => void;
  onBrandClick: (brandId: string) => void;
};

function NavDivider() {
  return (
    <div className="h-6 w-px shrink-0 bg-grey-100" aria-hidden />
  );
}

export function DockControls({
  activeBrandId,
  variant,
  onHomeClick,
  onBrandClick,
}: DockControlsProps) {
  const isFloating = variant === "floating";
  const homeActive = activeBrandId === null;

  return (
    <>
      <button
        type="button"
        onClick={onHomeClick}
        aria-pressed={homeActive}
        aria-label="Home"
        className={`flex shrink-0 items-center justify-center transition-[width,height,background-color] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
          isFloating ? "size-10 rounded-sm" : "size-6 rounded-xs"
        } ${
          isFloating
            ? homeActive
              ? "bg-primary-500 text-white"
              : "bg-[var(--container-input)] text-text-subtle hover:bg-white/10"
            : "bg-[var(--container-input)] text-text-subtle hover:bg-white/10"
        }`}
      >
        <House
          size={isFloating ? 16 : 12}
          weight={homeActive && isFloating ? "fill" : "regular"}
        />
      </button>

      <NavDivider />

      {DOCK_BRANDS.map((brand) => {
        const isActive = activeBrandId === brand.id;
        return (
          <button
            key={brand.id}
            type="button"
            onClick={() => onBrandClick(brand.id)}
            aria-pressed={isActive}
            aria-label={brand.name}
            className={`relative shrink-0 overflow-hidden rounded-xs transition-[width,height,opacity,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
              isFloating ? "size-10" : "size-6"
            } ${
              isFloating
                ? isActive
                  ? "ring-2 ring-primary-500 ring-offset-2"
                  : "opacity-80 hover:opacity-100 hover:ring-1 hover:ring-grey-100"
                : isActive
                  ? "border-2 border-primary-500 shadow-[inset_0px_0px_8px_0px_rgba(78,158,248,0.6)]"
                  : "opacity-80 hover:opacity-100"
            }`}
          >
            <Image
              src={brand.logoUrl}
              alt={brand.name}
              fill
              className="object-cover"
              unoptimized
            />
          </button>
        );
      })}
    </>
  );
}

type MorphingDockShellProps = {
  variant: DockVariant;
  navLabel: string;
  children: ReactNode;
  /** v2 module dock uses 48px bar (Figma 2537:15106); v1 uses 40px */
  stickyBarClass?: string;
  /** v2 sticky module row — Figma 2537:15106 px-16 py-8 */
  stickyNavClass?: string;
};

/**
 * Dock controls stay horizontally centered (left-1/2 -translate-x-1/2) at all times.
 * Only bottom offset, sticky bar height, and pill chrome animate — avoids left/center jump.
 */
export function MorphingDockShell({
  variant,
  navLabel,
  children,
  stickyBarClass = "h-10",
  stickyNavClass = "gap-2 p-2",
}: MorphingDockShellProps) {
  const isSticky = variant === "sticky";

  return (
    <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
      <div
        aria-hidden={!isSticky}
        className={`absolute inset-x-0 bottom-0 bg-grey-100 transition-[height] duration-200 ease-out ${
          isSticky ? stickyBarClass : "h-0"
        }`}
      />

      <div
        className={`absolute left-1/2 flex -translate-x-1/2 transition-[bottom] duration-200 ease-out ${
          isSticky ? "bottom-0" : "bottom-4"
        }`}
      >
        <nav
          aria-label={navLabel}
          className={`pointer-events-auto flex items-center transition-[background-color,box-shadow,border-radius,padding] duration-200 ease-out ${
            isSticky
              ? `rounded-none bg-transparent shadow-none ${stickyNavClass}`
              : "gap-2 rounded-md border border-line bg-grey-50 p-2 shadow-card"
          }`}
        >
          {children}
        </nav>
      </div>
    </footer>
  );
}

type MorphingDockProps = {
  variant: DockVariant;
  activeBrandId: string | null;
  onHomeClick: () => void;
  onBrandClick: (brandId: string) => void;
};

/** v1 dock — brand switcher controls */
export function MorphingDock({
  variant,
  activeBrandId,
  onHomeClick,
  onBrandClick,
}: MorphingDockProps) {
  return (
    <MorphingDockShell variant={variant} navLabel="Brand switcher">
      <DockControls
        activeBrandId={activeBrandId}
        variant={variant}
        onHomeClick={onHomeClick}
        onBrandClick={onBrandClick}
      />
    </MorphingDockShell>
  );
}
