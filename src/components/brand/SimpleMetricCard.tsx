"use client";

import type { CSSProperties } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import type { SimpleMetric } from "@/data/brandStatic";
import { useAnimateOnEntry } from "@/hooks/useAnimateOnEntry";
import { MetricValueReveal } from "./MetricValueReveal";

type SimpleMetricCardProps = {
  metric: SimpleMetric;
  entranceDelay?: number;
  variant?: "default" | "inverse";
  selectable?: boolean;
  selected?: boolean;
  onToggle?: () => void;
};

export function SimpleMetricCard({
  metric,
  entranceDelay = 0,
  variant = "default",
  selectable = false,
  selected = false,
  onToggle,
}: SimpleMetricCardProps) {
  const { ref, entered } = useAnimateOnEntry<HTMLElement>();
  const isInverse = variant === "inverse";

  const style = {
    "--enter-delay": `${entranceDelay}ms`,
  } as CSSProperties;

  const selectionClasses = selectable
    ? selected
      ? "cursor-pointer ring-2 ring-primary-500 ring-offset-2 ring-offset-card-bg"
      : "cursor-pointer transition-shadow hover:ring-1 hover:ring-primary-400 hover:ring-offset-2 hover:ring-offset-card-bg"
    : "";

  const handleClick = () => {
    if (selectable && onToggle) onToggle();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectable || !onToggle) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <article
      ref={ref}
      role={selectable ? "button" : undefined}
      tabIndex={selectable ? 0 : undefined}
      aria-pressed={selectable ? selected : undefined}
      aria-label={selectable ? `${metric.label}, ${selected ? "selected" : "not selected"}` : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`animate-enter animate-enter-card-rise relative flex flex-col gap-4 rounded-md border border-line p-4 ${
        entered ? "is-entered" : ""
      } ${isInverse ? "min-w-0 flex-1 basis-[200px]" : "bg-grey-50"} ${selectionClasses}`}
      style={style}
    >
      {selected && (
        <span
          className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary-500 text-white"
          aria-hidden
        >
          <CheckCircle size={14} weight="fill" />
        </span>
      )}
      <p
        className={`text-sm tracking-[-0.14px] ${
          isInverse ? "text-text-inverse-subtlest" : "text-text-subtlest"
        }`}
      >
        {metric.label}
      </p>
      <MetricValueReveal
        value={metric.value}
        play={entered}
        delay={(entranceDelay + 120) / 1000}
        className={isInverse ? "text-text-inverse" : ""}
      />
    </article>
  );
}
