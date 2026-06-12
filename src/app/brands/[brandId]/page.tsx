import { notFound, redirect } from "next/navigation";
import {
  brandInsightsPath,
  getBrandIdsForStaticParams,
  isRouteableBrandId,
  normalizeSlug,
} from "@/lib/brandRoutes";

type PageProps = {
  params: Promise<{ brandId: string }>;
};

export function generateStaticParams() {
  return getBrandIdsForStaticParams().map((brandId) => ({ brandId }));
}

export default async function BrandIndexPage({ params }: PageProps) {
  const { brandId: rawBrandId } = await params;
  const brandId = normalizeSlug(rawBrandId);

  if (!isRouteableBrandId(brandId)) {
    notFound();
  }

  redirect(brandInsightsPath(brandId, "overview"));
}
