import { notFound } from "next/navigation";
import { AppShellV3 } from "@/components/nav-v3/AppShellV3";
import {
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

export default async function BrandSettingsPage({ params }: PageProps) {
  const { brandId: rawBrandId } = await params;
  const brandId = normalizeSlug(rawBrandId);

  if (!isRouteableBrandId(brandId)) {
    notFound();
  }

  return <AppShellV3 />;
}
