import type { SimpleMetric } from "@/data/brandStatic";

type SimpleMetricCardProps = {
  metric: SimpleMetric;
};

export function SimpleMetricCard({ metric }: SimpleMetricCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-md bg-white p-4">
      <p className="text-sm text-text-subtlest tracking-[-0.14px]">
        {metric.label}
      </p>
      <p className="text-[32px] font-medium leading-[1.2] tracking-[-0.48px]">
        {metric.value}
      </p>
    </article>
  );
}
