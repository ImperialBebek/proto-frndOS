import { notFound, redirect } from "next/navigation";
import { AppShellV3 } from "@/components/nav-v3/AppShellV3";
import {
  brandInsightsPath,
  getBrandIdsForStaticParams,
  getBrandModuleIdsForStaticParams,
  isNonInsightsModule,
  isValidBrandId,
  isValidBrandModuleId,
  normalizeSlug,
} from "@/lib/brandRoutes";

type PageProps = {
  params: Promise<{ brandId: string; module: string }>;
};

export function generateStaticParams() {
  const brandIds = getBrandIdsForStaticParams();
  const modules = getBrandModuleIdsForStaticParams();
  return brandIds.flatMap((brandId) =>
    modules.map((module) => ({ brandId, module }))
  );
}

export default async function BrandModulePage({ params }: PageProps) {
  const { brandId: rawBrandId, module: rawModule } = await params;
  const brandId = normalizeSlug(rawBrandId);
  const brandModule = normalizeSlug(rawModule);

  if (!isValidBrandId(brandId)) {
    notFound();
  }

  if (brandModule === "insights") {
    redirect(brandInsightsPath(brandId, "overview"));
  }

  if (!isValidBrandModuleId(brandModule) || !isNonInsightsModule(brandModule)) {
    notFound();
  }

  return <AppShellV3 />;
}
