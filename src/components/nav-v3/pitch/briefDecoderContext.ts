import type { BriefOptionId } from "@/data/pitchStatic";
import type { BriefDecoderVariant } from "@/hooks/useBriefDecoderVariant";

export type BriefDecoderFocusField = {
  fieldKey: string;
  label: string;
  value: string;
  sectionRef: string;
};

export type BriefDecoderContext = {
  variant: BriefDecoderVariant;
  variantLabel: string;
  variantMode: "Briefcase" | "Matrix" | "War-room";
  optionId: BriefOptionId;
  lens: string;
  focusedField?: BriefDecoderFocusField | null;
  defaultField?: BriefDecoderFocusField | null;
};
