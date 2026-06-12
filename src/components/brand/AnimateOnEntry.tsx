"use client";

import {
  createElement,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { useAnimateOnEntry } from "@/hooks/useAnimateOnEntry";

export type EntranceVariant = "fade-up" | "text-reveal" | "card-rise" | "fade-only";

type AnimateOnEntryProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  variant?: EntranceVariant;
  /** Stagger offset in ms (subtle: 40–70) */
  delay?: number;
  root?: Element | null;
  threshold?: number;
};

export function AnimateOnEntry({
  as: Component = "div",
  children,
  className = "",
  variant = "fade-up",
  delay = 0,
  root,
  threshold,
}: AnimateOnEntryProps) {
  const { ref, entered } = useAnimateOnEntry<HTMLElement>({
    root,
    threshold,
  });

  const style = {
    "--enter-delay": `${delay}ms`,
  } as CSSProperties;

  return createElement(
    Component,
    {
      ref,
      className: `animate-enter animate-enter-${variant} ${entered ? "is-entered" : ""} ${className}`.trim(),
      style,
    },
    children
  );
}
