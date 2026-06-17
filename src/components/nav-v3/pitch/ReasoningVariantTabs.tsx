/** Floating tab switcher for track-reasoning UX variants */

"use client";

import { FloatingTabSwitcher } from "./FloatingTabSwitcher";

export type ReasoningVariant = "drawer" | "inline" | "trace";

const VARIANTS: { id: ReasoningVariant; label: string }[] = [
  { id: "drawer", label: "Variant 1" },
  { id: "inline", label: "Variant 2" },
  { id: "trace", label: "Variant 3" },
];

export function ReasoningVariantTabs({
  value,
  onChange,
}: {
  value: ReasoningVariant;
  onChange: (variant: ReasoningVariant) => void;
}) {
  return (
    <FloatingTabSwitcher
      value={value}
      onChange={onChange}
      options={VARIANTS}
      ariaLabel="Track reasoning layout variant"
    />
  );
}
