/** PROTOTYPE v2 brand view — Figma 2537:14241 */

"use client";

import { useRef } from "react";
import { FunnelSimple, CalendarBlank } from "@phosphor-icons/react";
import { DOCK_BRANDS } from "@/data/homeStatic";
import {
  QUICK_BRIEF_TEXT,
  QUICK_BRIEF_CHIPS,
  TOP_PROGRESS_METRICS,
  BREAKDOWN_ROW_METRICS,
  BREAKDOWN_GRID_METRICS,
} from "@/data/brandStatic";
import { ProgressMetricCard } from "./ProgressMetricCard";
import { SimpleMetricCard } from "./SimpleMetricCard";
import { AudienceAgeChart } from "./AudienceAgeChart";
import { BrandFloatingPills } from "./BrandFloatingPills";

type BrandPageV2Props = {
  brandId: string;
};

export function BrandPageV2({ brandId }: BrandPageV2Props) {
  const scrollRef = useRef<HTMLElement>(null);
  const brand = DOCK_BRANDS.find((b) => b.id === brandId);

  return (
    <div className="flex min-h-0 flex-1 flex-col px-2 pt-0 pb-0">
      <div
        key={brandId}
        className="animate-card-expand relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-md bg-grey-50 shadow-command"
      >
        <main
          ref={scrollRef}
          className="flex flex-1 flex-col items-center gap-16 overflow-y-auto px-[119px] py-20 pb-28"
        >
          {brand && <p className="sr-only">Viewing {brand.name}</p>}

          <section
            data-section-id="quick-brief"
            className="flex w-full max-w-[1186px] flex-col items-center gap-8 px-[120px] py-8"
          >
            <p className="text-sm font-medium text-text-subtlest tracking-[-0.14px]">
              Quick Brief
            </p>
            <p className="bg-gradient-to-b from-primary-700 via-primary-400 via-[75%] to-primary-50 bg-clip-text text-center text-[32px] font-medium leading-[1.2] tracking-[-0.48px] text-transparent">
              {QUICK_BRIEF_TEXT}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {QUICK_BRIEF_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="rounded-rounded bg-primary-50 px-3 py-2 text-sm font-medium text-primary-600 tracking-[-0.14px]"
                >
                  {chip}
                </span>
              ))}
            </div>
          </section>

          <section
            data-section-id="performance"
            className="flex w-full max-w-[1186px] flex-col gap-12"
          >
            <div className="flex w-full flex-wrap gap-2">
              {TOP_PROGRESS_METRICS.map((metric) => (
                <ProgressMetricCard key={metric.label} metric={metric} />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium leading-[1.2] tracking-[-0.36px]">
                Performance breakdown
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-8 items-center gap-2 rounded-rounded border border-grey-100 bg-white px-4 text-xs font-medium transition-colors hover:bg-grey-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                  <FunnelSimple size={16} />
                  Filters
                </button>
                <button
                  type="button"
                  className="flex h-8 items-center gap-2 rounded-rounded border border-grey-100 bg-white px-3 text-xs font-medium transition-colors hover:bg-grey-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                >
                  <CalendarBlank size={16} />
                  01/10/25 - 18/12/25
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {BREAKDOWN_ROW_METRICS.map((metric) => (
                <SimpleMetricCard key={metric.label} metric={metric} />
              ))}
            </div>
          </section>

          <section
            data-section-id="audience"
            className="flex w-full max-w-[1186px] gap-4"
          >
            <div className="grid flex-1 grid-cols-2 gap-2">
              {BREAKDOWN_GRID_METRICS.map((metric) => (
                <SimpleMetricCard key={metric.label} metric={metric} />
              ))}
            </div>
            <article className="flex h-[334px] flex-1 flex-col rounded-md bg-white p-4">
              <AudienceAgeChart />
            </article>
          </section>
        </main>

        <BrandFloatingPills scrollRootRef={scrollRef} />
      </div>
    </div>
  );
}
