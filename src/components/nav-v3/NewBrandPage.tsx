/** PROTOTYPE lightweight brand shell creation — /brands/new */

"use client";

import { useState } from "react";
import { ArrowLeft, ImageSquare } from "@phosphor-icons/react";
import {
  BRAND_INDUSTRY_OPTIONS,
  type BrandIndustry,
} from "@/data/brandAccessStatic";
import { useBrands } from "@/context/BrandsProvider";
import { brandInsightsPath } from "@/lib/brandRoutes";

type NewBrandPageProps = {
  onBack: () => void;
  onCreated: (path: string) => void;
};

export function NewBrandPage({ onBack, onCreated }: NewBrandPageProps) {
  const { createBrand } = useBrands();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState<BrandIndustry>("FMCG");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Enter a brand name to continue.");
      return;
    }
    const brand = createBrand({ name: trimmed, industry });
    onCreated(brandInsightsPath(brand.id, "overview"));
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-16 py-12">
      <div className="mx-auto flex w-full max-w-[560px] flex-col gap-8">
        <button
          type="button"
          onClick={onBack}
          className="flex w-fit items-center gap-2 text-sm font-medium text-text-inverse-subtle transition hover:text-text-inverse"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] font-medium tracking-[-0.48px] text-text-inverse">
            Create your brand
          </h1>
          <p className="text-sm text-text-inverse-subtle">
            Start with the basics. You can connect channels and invite teammates
            after your brand is created.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text-inverse">
              Brand name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="e.g. Ultra Milk"
              className="h-11 rounded-md border border-line bg-white/[0.04] px-4 text-sm text-text-inverse placeholder:text-text-inverse-subtlest focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text-inverse">
              Industry
            </span>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value as BrandIndustry)}
              className="h-11 rounded-md border border-line bg-white/[0.04] px-4 text-sm text-text-inverse focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            >
              {BRAND_INDUSTRY_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-[#1a1a1a]">
                  {option}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text-inverse">
              Logo <span className="font-normal text-text-inverse-subtlest">(optional)</span>
            </span>
            <div className="flex h-24 items-center justify-center gap-2 rounded-md border border-dashed border-line bg-white/[0.02] text-sm text-text-inverse-subtlest">
              <ImageSquare size={20} />
              Upload coming soon
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="h-11 rounded-md bg-white px-4 text-sm font-medium text-black transition hover:bg-white/90"
          >
            Create brand
          </button>
        </form>
      </div>
    </div>
  );
}
