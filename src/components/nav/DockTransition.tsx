/** Morphing dock at viewport bottom — floating ↔ sticky with shrink */

"use client";

import { MorphingDock } from "./BottomDock";

type DockTransitionProps = {
  showBrand: boolean;
  activeBrandId: string | null;
  onHomeClick: () => void;
  onBrandClick: (brandId: string) => void;
};

export function DockTransition({
  showBrand,
  activeBrandId,
  onHomeClick,
  onBrandClick,
}: DockTransitionProps) {
  return (
    <MorphingDock
      variant={showBrand ? "sticky" : "floating"}
      activeBrandId={activeBrandId}
      onHomeClick={onHomeClick}
      onBrandClick={onBrandClick}
    />
  );
}
