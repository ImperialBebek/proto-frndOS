/** PROTOTYPE brands section — Figma 2492:6233 (layer name "Latest Features" is stale) */

import { BRAND_CARDS } from "@/data/homeStatic";
import { MetricsCard } from "./MetricsCard";

type BrandsSectionProps = {
  onBrandSelect?: (brandId: string) => void;
  /** v2: cards are display-only; enter brand via top switcher */
  displayOnly?: boolean;
};

export function BrandsSection({
  onBrandSelect,
  displayOnly = false,
}: BrandsSectionProps) {
  return (
    <section
      className={`flex w-full max-w-[1280px] flex-col gap-4 ${
        displayOnly ? "pointer-events-none select-none" : ""
      }`}
    >
      <h2 className="text-xl font-medium tracking-[-0.4px] text-text-default">
        Your brands
      </h2>
      <div className="grid grid-cols-3 gap-6">
        {BRAND_CARDS.map((brand) =>
          displayOnly ? (
            <div key={brand.id} className="rounded-md">
              <MetricsCard brand={brand} />
            </div>
          ) : (
            <button
              key={brand.id}
              type="button"
              onClick={() => onBrandSelect?.(brand.id)}
              className="rounded-md text-left transition-transform hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
            >
              <MetricsCard brand={brand} />
            </button>
          )
        )}
      </div>
    </section>
  );
}
