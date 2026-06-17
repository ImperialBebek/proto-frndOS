/** Persisted brief-option selection per pitch (Safe / Balanced / Bold). */

"use client";

import { useCallback, useEffect, useState } from "react";
import type { BriefOptionId } from "@/data/pitchStatic";

const STORAGE_PREFIX = "frnd.pitch.briefOption.";

function storageKey(pitchId: string) {
  return `${STORAGE_PREFIX}${pitchId}`;
}

export function readSelectedBriefOption(pitchId: string): BriefOptionId | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(storageKey(pitchId));
  if (stored === "safe" || stored === "balanced" || stored === "bold") {
    return stored;
  }
  return null;
}

export function writeSelectedBriefOption(
  pitchId: string,
  optionId: BriefOptionId
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(pitchId), optionId);
  window.dispatchEvent(
    new CustomEvent("frnd:brief-option-change", {
      detail: { pitchId, optionId },
    })
  );
}

export function useBriefOptions(pitchId: string) {
  const [selectedOptionId, setSelectedOptionId] =
    useState<BriefOptionId>("balanced");

  useEffect(() => {
    const stored = readSelectedBriefOption(pitchId);
    if (stored) setSelectedOptionId(stored);
  }, [pitchId]);

  const selectOption = useCallback(
    (optionId: BriefOptionId) => {
      setSelectedOptionId(optionId);
      writeSelectedBriefOption(pitchId, optionId);
    },
    [pitchId]
  );

  const confirmOption = useCallback(
    (optionId: BriefOptionId = selectedOptionId) => {
      writeSelectedBriefOption(pitchId, optionId);
    },
    [pitchId, selectedOptionId]
  );

  return {
    selectedOptionId,
    selectOption,
    confirmOption,
  };
}

/** Build a stable per-option field key for EditableAIItem overrides */
export function briefFieldKey(
  pitchId: string,
  optionId: BriefOptionId,
  suffix: string
) {
  return `${pitchId}:${optionId}:${suffix}`;
}
