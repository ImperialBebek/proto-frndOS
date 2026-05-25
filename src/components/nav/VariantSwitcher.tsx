/** PROTOTYPE dev helper — toggle v1 / v2 */

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { parseNavVariant } from "@/data/navV2Static";

export function VariantSwitcher() {
  const searchParams = useSearchParams();
  const variant = parseNavVariant(searchParams.get("variant"));
  const isV2 = variant === "v2";

  return (
    <div className="fixed right-4 top-4 z-[100] flex rounded-rounded border border-grey-100 bg-white p-1 text-xs font-medium shadow-card">
      <Link
        href="/"
        className={`rounded-rounded px-2 py-1 transition-colors ${
          !isV2 ? "bg-primary-500 text-white" : "text-text-subtle hover:bg-grey-50"
        }`}
      >
        v1
      </Link>
      <Link
        href="/?variant=v2"
        className={`rounded-rounded px-2 py-1 transition-colors ${
          isV2 ? "bg-primary-500 text-white" : "text-text-subtle hover:bg-grey-50"
        }`}
      >
        v2
      </Link>
    </div>
  );
}
