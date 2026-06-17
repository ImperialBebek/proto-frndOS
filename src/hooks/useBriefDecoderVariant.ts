/** Dev toggle for Brief Decoder layout variants A / B / C */

"use client";

import { useCallback, useEffect, useState } from "react";

export type BriefDecoderVariant = "A" | "B" | "C";

const STORAGE_KEY = "frnd.pitch.briefDecoderVariant";

function parseVariant(value: string | null): BriefDecoderVariant | null {
  const upper = value?.toUpperCase();
  if (upper === "A" || upper === "B" || upper === "C") return upper;
  return null;
}

export function useBriefDecoderVariant() {
  const [variant, setVariantState] = useState<BriefDecoderVariant>("A");

  useEffect(() => {
    const fromUrl = parseVariant(
      new URLSearchParams(window.location.search).get("bd")
    );
    if (fromUrl) {
      setVariantState(fromUrl);
      return;
    }
    const stored = parseVariant(window.localStorage.getItem(STORAGE_KEY));
    if (stored) setVariantState(stored);
  }, []);

  const setVariant = useCallback((next: BriefDecoderVariant) => {
    setVariantState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    const url = new URL(window.location.href);
    url.searchParams.set("bd", next.toLowerCase());
    window.history.replaceState({}, "", url.toString());
  }, []);

  return { variant, setVariant };
}
