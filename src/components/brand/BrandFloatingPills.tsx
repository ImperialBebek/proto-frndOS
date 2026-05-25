/** PROTOTYPE v2 floating pills — Figma 2544:15217 */

"use client";

import { useEffect, useRef, useState } from "react";
import { StarFour } from "@phosphor-icons/react";
import {
  BRAND_SECTION_IDS,
  SECTION_SUGGESTIONS,
  type BrandSectionId,
} from "@/data/brandStatic";

type BrandFloatingPillsProps = {
  scrollRootRef: React.RefObject<HTMLElement | null>;
};

export function BrandFloatingPills({ scrollRootRef }: BrandFloatingPillsProps) {
  const [activeSectionId, setActiveSectionId] =
    useState<BrandSectionId>("quick-brief");
  const ratiosRef = useRef<Record<BrandSectionId, number>>({
    "quick-brief": 0,
    performance: 0,
    audience: 0,
  });

  useEffect(() => {
    const root = scrollRootRef.current;
    if (!root) return;

    const sections = BRAND_SECTION_IDS.map((id) =>
      root.querySelector<HTMLElement>(`[data-section-id="${id}"]`)
    ).filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute(
            "data-section-id"
          ) as BrandSectionId;
          if (id) {
            ratiosRef.current[id] = entry.intersectionRatio;
          }
        }

        let best: BrandSectionId = "quick-brief";
        let bestRatio = 0;
        for (const id of BRAND_SECTION_IDS) {
          if (ratiosRef.current[id] > bestRatio) {
            bestRatio = ratiosRef.current[id];
            best = id;
          }
        }
        setActiveSectionId(best);
      },
      { root, threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, [scrollRootRef]);

  const suggestions = SECTION_SUGGESTIONS[activeSectionId].slice(0, 3);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-4"
      aria-live="polite"
    >
      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          aria-label="Ask Anything"
          className="flex h-[33px] items-center gap-2 rounded-rounded bg-white px-4 text-sm font-medium text-text-default shadow-card transition-colors hover:bg-grey-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          <StarFour size={16} weight="fill" className="text-primary-500" />
          Ask Anything
        </button>

        <div
          key={activeSectionId}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {suggestions.map((text, index) => (
            <button
              key={`${activeSectionId}-${text}`}
              type="button"
              className="animate-pill-pop h-[33px] max-w-[280px] truncate rounded-rounded bg-white px-4 text-sm font-medium text-text-default shadow-card transition-colors hover:bg-grey-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
