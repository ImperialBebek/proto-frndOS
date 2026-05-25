import type { ProgressMetric } from "@/data/brandStatic";

const barColors = {
  positive: "bg-positive-600",
  warning: "bg-warning-500",
} as const;

type ProgressMetricCardProps = {
  metric: ProgressMetric;
};

export function ProgressMetricCard({ metric }: ProgressMetricCardProps) {
  return (
    <article className="flex min-w-0 flex-1 flex-col gap-4 rounded-md bg-white p-4">
      <p className="text-sm text-text-subtlest tracking-[-0.14px]">
        {metric.label}
      </p>
      <p className="text-[32px] font-medium leading-[1.2] tracking-[-0.48px]">
        {metric.value}
      </p>
      <div className="flex flex-col gap-3">
        <div className="h-1 w-full overflow-hidden rounded-2xl bg-grey-200">
          <div
            className={`h-full rounded-2xl ${barColors[metric.progressColor]}`}
            style={{ width: `${metric.progress}%` }}
          />
        </div>
        <div className="flex items-baseline justify-between">
          <span className="rounded bg-[var(--container-translucent-subtle)] px-1 py-0.5 text-xs font-medium text-text-inverse backdrop-blur-[8px]">
            {metric.badge}
          </span>
          <span className="text-sm text-text-subtlest tracking-[-0.14px]">
            {metric.target}
          </span>
        </div>
      </div>
    </article>
  );
}
