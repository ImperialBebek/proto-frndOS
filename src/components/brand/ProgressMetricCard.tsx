"use client";

import type { CSSProperties } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import type { ProgressMetric } from "@/data/brandStatic";
import { useAnimateOnEntry } from "@/hooks/useAnimateOnEntry";
import { MetricValueReveal } from "./MetricValueReveal";

const barColors = {
  positive: "bg-positive-600",
  warning: "bg-warning-500",
} as const;

type ProgressMetricCardProps = {
  metric: ProgressMetric;
  /** Stagger offset in ms when card enters viewport */
  entranceDelay?: number;
  variant?: "default" | "inverse";
  selectable?: boolean;
  selected?: boolean;
  onToggle?: () => void;
};

export function ProgressMetricCard({
  metric,
  entranceDelay = 0,
  variant = "default",
  selectable = false,
  selected = false,
  onToggle,
}: ProgressMetricCardProps) {
  const { ref, entered } = useAnimateOnEntry<HTMLElement>();
  const isInverse = variant === "inverse";
  const barDelay = entranceDelay + 180;

  const cardStyle = {
    "--enter-delay": `${entranceDelay}ms`,
  } as CSSProperties;

  const barTrackStyle = {
    "--enter-delay": `${barDelay}ms`,
  } as CSSProperties;

  const barFillStyle = {
    "--bar-target-width": `${metric.progress}%`,
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
      className={`animate-enter animate-enter-card-rise relative flex min-w-0 flex-1 flex-col gap-4 rounded-md border border-line p-4 ${
        entered ? "is-entered" : ""
      } ${isInverse ? "min-w-0 flex-1 basis-[200px]" : "bg-grey-50"} ${selectionClasses}`}
      style={cardStyle}
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
      <div className="flex flex-col gap-3">
        <div
          className={`animate-bar-track h-1 w-full overflow-hidden rounded-2xl ${
            entered ? "is-bar-entered" : ""
          } ${isInverse ? "bg-white/[0.1]" : "bg-grey-200"}`}
          style={barTrackStyle}
        >
          <div
            className={`animate-bar-fill h-full rounded-2xl ${barColors[metric.progressColor]}`}
            style={barFillStyle}
          />
        </div>
        <div className="flex items-baseline justify-between">
          <span
            className={`rounded px-1 py-0.5 text-xs font-medium backdrop-blur-[8px] ${
              isInverse
                ? "bg-[var(--container-translucent)] text-text-inverse"
                : "bg-[var(--container-translucent-subtle)] text-text-inverse"
            }`}
          >
            {metric.badge}
          </span>
          <span
            className={`text-sm tracking-[-0.14px] ${
              isInverse ? "text-text-inverse-subtlest" : "text-text-subtlest"
            }`}
          >
            {metric.target}
          </span>
        </div>
      </div>
    </article>
  );
}
