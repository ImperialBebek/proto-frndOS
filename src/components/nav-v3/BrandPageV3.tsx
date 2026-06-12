/** PROTOTYPE v3 dark brand page — Figma 2614:8356 */

"use client";

import { useCallback, useRef, useState } from "react";
import { FunnelSimple, CalendarBlank } from "@phosphor-icons/react";
import { useBrands } from "@/context/BrandsProvider";
import {
  QUICK_BRIEF_TEXT,
  QUICK_BRIEF_CHIPS,
  TOP_PROGRESS_METRICS,
  BREAKDOWN_ROW_METRICS,
  BREAKDOWN_GRID_METRICS,
} from "@/data/brandStatic";
import { ProgressMetricCard } from "@/components/brand/ProgressMetricCard";
import { SimpleMetricCard } from "@/components/brand/SimpleMetricCard";
import { AudienceAgeChart } from "@/components/brand/AudienceAgeChart";
import { BrandFloatingPills, type SelectedMetricChip } from "@/components/brand/BrandFloatingPills";
import { AnimateOnEntry } from "@/components/brand/AnimateOnEntry";
import { QuickBriefReveal } from "@/components/brand/QuickBriefReveal";
import {
  getBrandContentTitle,
  type BrandModuleId,
  type BrandInsightsTabId,
} from "@/data/navV3Static";
import { PlaceholderPage } from "./PlaceholderPage";
import { BrandSetupBanner } from "./BrandSetupBanner";

const STAGGER = 55;

type BrandPageV3Props = {
  brandId: string;
  brandModule: BrandModuleId;
  brandInsightsTab: BrandInsightsTabId;
  onAskFrndOpen?: (message?: string, agentId?: string) => void;
};

export function BrandPageV3({
  brandId,
  brandModule,
  brandInsightsTab,
  onAskFrndOpen,
}: BrandPageV3Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pointAndAskActive, setPointAndAskActive] = useState(false);
  const [selectedCards, setSelectedCards] = useState<SelectedMetricChip[]>([]);

  const toggleCard = useCallback((id: string, label: string) => {
    setSelectedCards((prev) => {
      const exists = prev.some((c) => c.id === id);
      if (exists) return prev.filter((c) => c.id !== id);
      return [...prev, { id, label }];
    });
  }, []);

  const removeSelectedCard = useCallback((id: string) => {
    setSelectedCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handlePointAndAskActivate = useCallback(() => {
    setPointAndAskActive(true);
  }, []);

  const handlePointAndAskCancel = useCallback(() => {
    setPointAndAskActive(false);
    setSelectedCards([]);
  }, []);

  const handlePointAndAskSubmit = useCallback(
    (message: string) => {
      setPointAndAskActive(false);
      setSelectedCards([]);
      onAskFrndOpen?.(message);
    },
    [onAskFrndOpen]
  );

  const { userBrands, isNewBrand, clearNewBrandFlag } = useBrands();
  const isCardSelected = (id: string) => selectedCards.some((c) => c.id === id);
  const brand = userBrands.find((b) => b.id === brandId);
  const showSetupBanner = isNewBrand(brandId);
  const isOverview =
    brandModule === "insights" && brandInsightsTab === "overview";

  if (!isOverview) {
    const title = getBrandContentTitle(brandModule, brandInsightsTab);
    return (
      <PlaceholderPage
        title={title}
        description={`${title} insights will appear here. This section is a placeholder in the prototype.`}
      />
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto"
      >
      <div className="flex min-h-full flex-col items-center px-16 py-12 pb-28">
        {brand && <p className="sr-only">Viewing {brand.name}</p>}

        <div className="flex w-full max-w-[1200px] flex-col gap-16">
          {showSetupBanner && brand && (
            <BrandSetupBanner
              brandName={brand.name}
              onDismiss={() => clearNewBrandFlag(brandId)}
            />
          )}

          <section
            data-section-id="quick-brief"
            className="flex flex-col items-center gap-8 px-12 py-8"
          >
            <QuickBriefReveal
              text={QUICK_BRIEF_TEXT}
              contextKey={`${brandId}-${brandModule}-${brandInsightsTab}`}
              className="bg-gradient-to-b from-primary-400 to-primary-50 bg-clip-text text-[32px] font-medium tracking-[-0.48px] text-transparent"
            />
            <div className="flex flex-wrap items-center justify-center gap-2">
              {QUICK_BRIEF_CHIPS.map((chip, index) => (
                <AnimateOnEntry
                  key={chip}
                  as="span"
                  variant="fade-up"
                  delay={STAGGER + index * 50}
                  className="rounded-rounded border border-line bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-text-inverse"
                >
                  {chip}
                </AnimateOnEntry>
              ))}
            </div>
          </section>

          <section
            data-section-id="performance"
            className="flex flex-col gap-12"
          >
            <div className="flex flex-wrap gap-2">
              {TOP_PROGRESS_METRICS.map((metric, index) => (
                <ProgressMetricCard
                  key={metric.label}
                  metric={metric}
                  variant="inverse"
                  entranceDelay={index * STAGGER}
                  selectable={pointAndAskActive}
                  selected={isCardSelected(metric.label)}
                  onToggle={() => toggleCard(metric.label, metric.label)}
                />
              ))}
            </div>

            <AnimateOnEntry
              variant="fade-up"
              className="flex items-center justify-between"
            >
              <h2 className="text-2xl font-medium leading-[1.2] tracking-[-0.36px] text-text-inverse">
                Performance breakdown
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-8 items-center gap-2 rounded-rounded border border-line px-4 text-xs font-medium text-text-inverse transition-colors hover:bg-white/[0.06]"
                >
                  <FunnelSimple size={16} />
                  Filters
                </button>
                <button
                  type="button"
                  className="flex h-8 items-center gap-2 rounded-rounded border border-line px-3 text-xs font-medium text-text-inverse transition-colors hover:bg-white/[0.06]"
                >
                  <CalendarBlank size={16} />
                  01/10/25 - 18/12/25
                </button>
              </div>
            </AnimateOnEntry>

            <div className="flex flex-wrap gap-2">
              {BREAKDOWN_ROW_METRICS.map((metric, index) => (
                <SimpleMetricCard
                  key={metric.label}
                  metric={metric}
                  variant="inverse"
                  entranceDelay={index * 50}
                  selectable={pointAndAskActive}
                  selected={isCardSelected(metric.label)}
                  onToggle={() => toggleCard(metric.label, metric.label)}
                />
              ))}
            </div>
          </section>

          <section data-section-id="audience" className="flex gap-4 pb-8">
            <div className="grid flex-1 grid-cols-2 gap-2">
              {BREAKDOWN_GRID_METRICS.map((metric, index) => (
                <SimpleMetricCard
                  key={metric.label}
                  metric={metric}
                  variant="inverse"
                  entranceDelay={index * 50}
                  selectable={pointAndAskActive}
                  selected={isCardSelected(metric.label)}
                  onToggle={() => toggleCard(metric.label, metric.label)}
                />
              ))}
            </div>
            <AnimateOnEntry
              as="article"
              variant="card-rise"
              className="flex h-[334px] flex-1 flex-col rounded-md border border-line p-4"
            >
              <AudienceAgeChart />
            </AnimateOnEntry>
          </section>
        </div>
      </div>
      </div>

      <BrandFloatingPills
        scrollRootRef={scrollRef}
        variant="dark"
        pinToViewport
        pointAndAskActive={pointAndAskActive}
        selectedCards={selectedCards}
        onPointAndAskActivate={handlePointAndAskActivate}
        onPointAndAskCancel={handlePointAndAskCancel}
        onPointAndAskSubmit={handlePointAndAskSubmit}
        onRemoveSelectedCard={removeSelectedCard}
      />
    </div>
  );
}
