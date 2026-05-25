/** PROTOTYPE v2 morphing dock — tools (home) ↔ modules (brand) */

"use client";

import type { ReactNode } from "react";
import { MorphingDockShell, type DockVariant } from "./BottomDock";

type DockTransitionV2Props = {
  showBrand: boolean;
  children: ReactNode;
  navLabel: string;
};

export function DockTransitionV2({
  showBrand,
  children,
  navLabel,
}: DockTransitionV2Props) {
  const variant: DockVariant = showBrand ? "sticky" : "floating";

  return (
    <MorphingDockShell
      variant={variant}
      navLabel={navLabel}
      stickyBarClass={showBrand ? "h-12" : "h-10"}
      stickyNavClass={showBrand ? "gap-2 px-4 py-2" : "gap-2 p-2"}
    >
      {children}
    </MorphingDockShell>
  );
}
