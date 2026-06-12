"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapClient";
import {
  formatMetricValue,
  parseMetricValue,
} from "@/lib/metricValue";

type MetricValueRevealProps = {
  value: string;
  className?: string;
  /** When true, plays entrance + count-up once */
  play: boolean;
  /** Delay in seconds before animation starts */
  delay?: number;
};

/**
 * GSAP metric value: rise-in + count-up for numeric / percent values.
 */
export function MetricValueReveal({
  value,
  className = "",
  play,
  delay = 0,
}: MetricValueRevealProps) {
  const valueRef = useRef<HTMLParagraphElement>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    hasPlayedRef.current = false;
  }, [value]);

  useGSAP(
    () => {
      const el = valueRef.current;
      if (!play || !el || hasPlayedRef.current) return;

      hasPlayedRef.current = true;
      const parsed = parseMetricValue(value);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        el.textContent = value;
        gsap.set(el, { opacity: 1, y: 0, scale: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (parsed.type === "text") {
          gsap.fromTo(
            el,
            { opacity: 0, y: 14, scale: 0.94 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              delay,
              ease: "power3.out",
              onStart: () => {
                el.textContent = value;
              },
            }
          );
          return;
        }

        const counter = { n: 0 };
        el.textContent =
          parsed.type === "percent"
            ? formatMetricValue(0, parsed)
            : formatMetricValue(0, parsed);

        const tl = gsap.timeline({ delay });

        tl.fromTo(
          el,
          { opacity: 0, y: 18, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            ease: "power3.out",
          },
          0
        );

        tl.to(
          counter,
          {
            n: parsed.numeric,
            duration: 1.15,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = formatMetricValue(counter.n, parsed);
            },
          },
          0.12
        );
      });

      return () => mm.revert();
    },
    { dependencies: [play, value, delay], scope: valueRef }
  );

  return (
    <p
      ref={valueRef}
      className={`text-[32px] font-medium leading-[1.2] tracking-[-0.48px] tabular-nums ${
        play ? "opacity-0" : ""
      } ${className}`.trim()}
      aria-label={value}
    >
      {play ? "\u00a0" : value}
    </p>
  );
}
