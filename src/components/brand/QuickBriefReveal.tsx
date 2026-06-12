"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapClient";
import { useAnimateOnEntry } from "@/hooks/useAnimateOnEntry";

type QuickBriefRevealProps = {
  text: string;
  /** Kept for compatibility with parent components. */
  contextKey?: string;
  className?: string;
};

function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

/**
 * Word-by-word GSAP reveal for the Quick Brief headline.
 * Animates once when the block first enters the viewport.
 */
export function QuickBriefReveal({
  text,
  contextKey,
  className = "",
}: QuickBriefRevealProps) {
  void contextKey;
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { ref: entryRef, entered } = useAnimateOnEntry<HTMLParagraphElement>();
  const words = splitWords(text);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    hasPlayedRef.current = false;
  }, [text]);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!entered || !root || hasPlayedRef.current) return;

      const wordEls = root.querySelectorAll<HTMLElement>("[data-quick-brief-word]");
      if (wordEls.length === 0) return;

      hasPlayedRef.current = true;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(wordEls, { opacity: 1, y: 0, filter: "none" });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          wordEls,
          {
            yPercent: 115,
            opacity: 0,
            filter: "blur(8px)",
          },
          {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.52,
            stagger: 0.04,
            ease: "power3.out",
          }
        );
      });

      return () => mm.revert();
    },
    { dependencies: [entered, text], scope: containerRef }
  );

  const setRefs = (node: HTMLParagraphElement | null) => {
    containerRef.current = node;
    entryRef.current = node;
  };

  return (
    <p
      ref={setRefs}
      className="flex flex-wrap justify-center gap-x-[0.28em] gap-y-1 text-center"
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="inline-block overflow-hidden align-bottom leading-[1.2]"
        >
          <span
            data-quick-brief-word
            className={`inline-block will-change-transform opacity-0 ${className}`.trim()}
          >
            {word}
          </span>
        </span>
      ))}
    </p>
  );
}
