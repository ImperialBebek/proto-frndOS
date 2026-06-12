import { notFound } from "next/navigation";
import { AppShellV3 } from "@/components/nav-v3/AppShellV3";
import {
  getBrandIdsForStaticParams,
  getBrandInsightsTabIdsForStaticParams,
  isValidBrandId,
  isValidBrandInsightsTabId,
  normalizeSlug,
} from "@/lib/brandRoutes";

type PageProps = {
  params: Promise<{ brandId: string; tab: string }>;
};

export function generateStaticParams() {
  const brandIds = getBrandIdsForStaticParams();
  const tabs = getBrandInsightsTabIdsForStaticParams();
  return brandIds.flatMap((brandId) =>
    tabs.map((tab) => ({ brandId, tab }))
  );
}

export default async function BrandInsightsTabPage({ params }: PageProps) {
  const { brandId: rawBrandId, tab: rawTab } = await params;
  const brandId = normalizeSlug(rawBrandId);
  const tab = normalizeSlug(rawTab);

  if (!isValidBrandId(brandId) || !isValidBrandInsightsTabId(tab)) {
    notFound();
  }

  return <AppShellV3 />;
}
