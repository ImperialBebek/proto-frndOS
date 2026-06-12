"use client";

import { CheckCircle, X } from "@phosphor-icons/react";

const SETUP_STEPS = [
  "Connect your channels",
  "Invite teammates",
  "Add brand details",
] as const;

type BrandSetupBannerProps = {
  brandName: string;
  onDismiss: () => void;
};

export function BrandSetupBanner({
  brandName,
  onDismiss,
}: BrandSetupBannerProps) {
  return (
    <div className="rounded-md border border-primary-500/20 bg-primary-500/[0.08] px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-inverse">
            Finish setting up {brandName}
          </p>
          <p className="mt-1 text-sm text-text-inverse-subtle">
            Your brand is ready. Complete these steps to get the most out of
            frndOS.
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {SETUP_STEPS.map((step) => (
              <li
                key={step}
                className="flex items-center gap-2 text-sm text-text-inverse-subtle"
              >
                <CheckCircle
                  size={16}
                  className="shrink-0 text-text-inverse-subtlest"
                />
                {step}
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss setup checklist"
          className="flex size-8 shrink-0 items-center justify-center rounded-rounded text-text-inverse-subtle transition hover:bg-white/[0.06] hover:text-text-inverse"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
