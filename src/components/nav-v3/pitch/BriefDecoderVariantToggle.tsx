/** Floating tab switcher for Brief Decoder layout variants A / B / C */

"use client";

import type { BriefDecoderVariant } from "@/hooks/useBriefDecoderVariant";
import { FloatingTabSwitcher } from "./FloatingTabSwitcher";

const VARIANTS: { id: BriefDecoderVariant; label: string }[] = [
  { id: "A", label: "Briefcase" },
  { id: "B", label: "Matrix" },
  { id: "C", label: "War-room" },
];

export function VariantToggle({
  variant,
  onChange,
}: {
  variant: BriefDecoderVariant;
  onChange: (v: BriefDecoderVariant) => void;
}) {
  return (
    <FloatingTabSwitcher
      value={variant}
      onChange={onChange}
      options={VARIANTS}
      ariaLabel="Brief decoder layout variant"
    />
  );
}
