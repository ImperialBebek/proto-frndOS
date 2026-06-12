/** PROTOTYPE floating pills — v2 Figma 2544:15217, v3 bottom nav 2617:6158 */

"use client";

import { useEffect, useRef, useState } from "react";
import { CursorClick, PaperPlaneRight, StarFour, X } from "@phosphor-icons/react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  BRAND_SECTION_IDS,
  SECTION_SUGGESTIONS,
  type BrandSectionId,
} from "@/data/brandStatic";
import { prefersReducedMotion } from "@/lib/v3ShellMotion";

export type SelectedMetricChip = {
  id: string;
  label: string;
};

type BrandFloatingPillsProps = {
  scrollRootRef: React.RefObject<HTMLElement | null>;
  /** Light pills on v2 card; dark on v3 content area */
  variant?: "light" | "dark";
  /** Pin to bottom of relative parent (not end of scroll document) */
  pinToViewport?: boolean;
  pointAndAskActive?: boolean;
  selectedCards?: SelectedMetricChip[];
  onPointAndAskActivate?: () => void;
  onPointAndAskCancel?: () => void;
  onPointAndAskSubmit?: (message: string) => void;
  onRemoveSelectedCard?: (id: string) => void;
};

const pillBase =
  "h-[33px] max-w-[280px] truncate rounded-rounded border px-4 text-sm font-medium shadow-card transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500";

const pillDark =
  "flex h-6 max-w-[280px] items-center justify-center rounded-md px-3 backdrop-blur-[4px] bg-primary-50/10 shadow-[inset_0_0_6px_0_var(--primary-400)] transition-shadow hover:shadow-[inset_0_0_8px_0_var(--primary-400)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500";

const pillDarkLabel =
  "truncate bg-gradient-to-b from-primary-400 to-primary-50 bg-clip-text text-xs font-medium leading-[1.4] text-transparent";

const pointAndAskButtonClass =
  "flex h-6 shrink-0 items-center gap-1 rounded-md bg-gradient-to-b from-primary-950 via-primary via-50% to-[#bde3fb] py-2 pl-2 pr-2.5 shadow-[0_0_4px_var(--primary-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500";

const pointAndAskLabelClass =
  "truncate bg-gradient-to-b from-primary-50 to-primary-300 bg-clip-text text-xs font-medium leading-[1.4] text-transparent";

const barLight =
  "bg-gradient-to-t from-card-bg via-card-bg/80 to-transparent";

const barDark =
  "bg-[radial-gradient(60%_140%_at_50%_100%,rgba(45,103,233,0.55),rgba(34,74,161,0.35)_40%,transparent_72%)]";

export function BrandFloatingPills({
  scrollRootRef,
  variant = "light",
  pinToViewport = false,
  pointAndAskActive = false,
  selectedCards = [],
  onPointAndAskActivate,
  onPointAndAskCancel,
  onPointAndAskSubmit,
  onRemoveSelectedCard,
}: BrandFloatingPillsProps) {
  const [activeSectionId, setActiveSectionId] =
    useState<BrandSectionId>("quick-brief");
  const [query, setQuery] = useState("");
  const ratiosRef = useRef<Record<BrandSectionId, number>>({
    "quick-brief": 0,
    performance: 0,
    audience: 0,
  });

  const barRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const inputWrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevActiveRef = useRef(pointAndAskActive);

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

  useGSAP(
    () => {
      const pills = pillsRef.current;
      const inputWrap = inputWrapRef.current;
      if (!pills || !inputWrap) return;

      const reduce = prefersReducedMotion();
      const activating = pointAndAskActive && !prevActiveRef.current;
      const deactivating = !pointAndAskActive && prevActiveRef.current;

      if (reduce) {
        gsap.set(pills, {
          autoAlpha: pointAndAskActive ? 0 : 1,
          scale: pointAndAskActive ? 0.9 : 1,
          pointerEvents: pointAndAskActive ? "none" : "auto",
        });
        gsap.set(inputWrap, {
          autoAlpha: pointAndAskActive ? 1 : 0,
          width: pointAndAskActive ? "100%" : 0,
          pointerEvents: pointAndAskActive ? "auto" : "none",
        });
      } else if (activating) {
        gsap
          .timeline()
          .to(pills, {
            autoAlpha: 0,
            scale: 0.9,
            duration: 0.18,
            ease: "power2.in",
            pointerEvents: "none",
          })
          .set(inputWrap, { display: "flex" })
          .fromTo(
            inputWrap,
            { autoAlpha: 0, width: 101 },
            {
              autoAlpha: 1,
              width: "100%",
              duration: 0.45,
              ease: "back.out(1.4)",
              pointerEvents: "auto",
            },
            "-=0.05"
          );
      } else if (deactivating) {
        gsap
          .timeline()
          .to(inputWrap, {
            autoAlpha: 0,
            width: 101,
            duration: 0.28,
            ease: "power2.in",
            pointerEvents: "none",
          })
          .set(inputWrap, { display: "none" })
          .to(
            pills,
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.32,
              ease: "back.out(1.6)",
              pointerEvents: "auto",
            },
            "-=0.08"
          );
      }

      prevActiveRef.current = pointAndAskActive;
    },
    { dependencies: [pointAndAskActive] }
  );

  useEffect(() => {
    if (pointAndAskActive) {
      inputRef.current?.focus();
    } else {
      setQuery("");
    }
  }, [pointAndAskActive]);

  const suggestions = SECTION_SUGGESTIONS[activeSectionId].slice(0, 3);
  const isDark = variant === "dark";
  const pillClass = isDark
    ? pillDark
    : `${pillBase} border-line bg-grey-50 text-text-default hover:bg-white/10`;
  const askClass = `${pillClass} flex items-center gap-2`;
  const barClass = isDark ? barDark : barLight;

  const positionClass = pinToViewport
    ? "absolute inset-x-0 bottom-0"
    : "sticky bottom-0";

  const buildMessage = () => {
    const cardLabels = selectedCards.map((c) => c.label);
    const prefix =
      cardLabels.length > 0 ? `[${cardLabels.join(", ")}] ` : "";
    return `${prefix}${query.trim()}`.trim();
  };

  const handleSubmit = () => {
    const message = buildMessage();
    if (!message) return;
    onPointAndAskSubmit?.(message);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      onPointAndAskCancel?.();
    }
  };

  return (
    <div
      ref={barRef}
      className={`pointer-events-none z-20 flex justify-center px-4 pb-4 pt-10 ${positionClass} ${barClass}`}
      aria-live="polite"
    >
      <div className="pointer-events-auto flex w-full max-w-[720px] flex-col items-center justify-center">
        <div
          ref={pillsRef}
          className="flex flex-wrap items-center justify-center gap-2"
          aria-hidden={pointAndAskActive}
        >
          {!isDark && (
            <button type="button" aria-label="Ask Anything" className={askClass}>
              <StarFour size={16} weight="fill" className="text-primary-500" />
              Ask Anything
            </button>
          )}

          {isDark && (
            <button
              type="button"
              aria-label="Point and Ask"
              className={pointAndAskButtonClass}
              onClick={onPointAndAskActivate}
            >
              <CursorClick size={14} weight="fill" className="text-primary-50" />
              <span className={pointAndAskLabelClass}>Point & Ask</span>
            </button>
          )}

          <div
            key={activeSectionId}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {suggestions.map((text, index) => (
              <button
                key={`${activeSectionId}-${text}`}
                type="button"
                className={`animate-pill-pop ${pillClass}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {isDark ? (
                  <span className={pillDarkLabel}>{text}</span>
                ) : (
                  text
                )}
              </button>
            ))}
          </div>
        </div>

        {isDark && (
          <div
            ref={inputWrapRef}
            className="hidden w-full items-center gap-2 rounded-md border border-line bg-[rgba(239,249,254,0.08)] px-3 py-2 backdrop-blur-[4px] shadow-[inset_0_0_6px_0_var(--primary-400)]"
            style={{ display: pointAndAskActive ? "flex" : "none" }}
            aria-hidden={!pointAndAskActive}
          >
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
              {selectedCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  aria-label={`Remove ${card.label}`}
                  onClick={() => onRemoveSelectedCard?.(card.id)}
                  className="flex max-w-[180px] items-center gap-1 rounded-md bg-primary-50/10 px-2 py-0.5 text-xs font-medium text-primary-300 transition-colors hover:bg-primary-50/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                  <span className="truncate">{card.label}</span>
                  <X size={12} weight="bold" aria-hidden />
                </button>
              ))}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={
                  selectedCards.length > 0
                    ? "Ask about selected metrics..."
                    : "Select cards on the page, then ask..."
                }
                aria-label="Point and Ask question"
                className="min-w-[120px] flex-1 bg-transparent text-sm text-text-inverse placeholder:text-text-inverse-subtlest focus:outline-none"
              />
            </div>
            <button
              type="button"
              aria-label="Cancel Point and Ask"
              onClick={onPointAndAskCancel}
              className="flex size-7 shrink-0 items-center justify-center rounded-md text-text-inverse-subtle transition-colors hover:bg-white/[0.08] hover:text-text-inverse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <X size={16} />
            </button>
            <button
              type="button"
              aria-label="Send question"
              onClick={handleSubmit}
              disabled={!buildMessage()}
              className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary-500 text-white transition-colors hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <PaperPlaneRight size={16} weight="fill" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
