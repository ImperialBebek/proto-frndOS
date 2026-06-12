"use client";

import { useEffect, useRef, useState } from "react";

type UseAnimateOnEntryOptions = {
  /** Intersection ratio required before triggering (0–1) */
  threshold?: number;
  /** Margin around root; negative bottom reveals slightly before fully in view */
  rootMargin?: string;
  root?: Element | null;
};

/**
 * Fires once when the element first enters the viewport.
 * Used for subtle staggered entrance animations.
 */
export function useAnimateOnEntry<T extends HTMLElement = HTMLDivElement>(
  options: UseAnimateOnEntryOptions = {}
) {
  const { threshold = 0.12, rootMargin = "0px 0px -4% 0px", root = null } =
    options;
  const ref = useRef<T>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (entered) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin, root: root ?? null }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [entered, threshold, rootMargin, root]);

  return { ref, entered };
}
