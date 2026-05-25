/** PROTOTYPE metrics card — Figma Metrics Card component */

import Image from "next/image";
import type { BrandCard } from "@/data/homeStatic";

const badgeStyles = {
  low: "bg-emerald-100 text-emerald-800",
  medium: "bg-yellow-100 text-yellow-900",
  monitoring: "bg-yellow-100 text-yellow-900",
} as const;

const trendStyles = {
  positive: "bg-emerald-100 text-emerald-800",
  negative: "bg-red-50 text-red-800",
} as const;

type MetricsCardProps = {
  brand: BrandCard;
};

export function MetricsCard({ brand }: MetricsCardProps) {
  const [impressions, spend, conversion, revenue] = brand.metrics;

  return (
    <article className="flex min-h-[208px] flex-col gap-6 rounded-md bg-white p-6 shadow-card transition-shadow hover:shadow-[0px_0px_8px_var(--grey-100)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative size-6 overflow-hidden rounded-rounded">
            <Image
              src={brand.logoUrl}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <span className="text-sm font-medium tracking-[-0.14px]">
            {brand.name}
          </span>
        </div>
        <span
          className={`rounded-xs px-1.5 py-0.5 text-xs font-medium ${badgeStyles[brand.badge.variant]}`}
        >
          {brand.badge.text}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <MetricCell metric={impressions} />
        <MetricCell metric={spend} />
        <MetricCell metric={conversion} />
        <MetricCell metric={revenue} />
      </div>
    </article>
  );
}

function MetricCell({
  metric,
}: {
  metric: BrandCard["metrics"][number];
}) {
  return (
    <div className="flex min-h-[48px] flex-col justify-between">
      <p className="text-xs text-text-subtle">{metric.label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-lg font-medium tracking-[-0.36px]">{metric.value}</p>
        {metric.trend && (
          <span
            className={`rounded px-1 py-0.5 text-xs font-medium ${trendStyles[metric.trend.variant]}`}
          >
            {metric.trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
