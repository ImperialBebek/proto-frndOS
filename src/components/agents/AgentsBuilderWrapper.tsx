"use client";

import { Suspense } from "react";
import { AgentsBuilderPage } from "./AgentsBuilderPage";

type AgentsBuilderWrapperProps = {
  onAskFrndOpen: (message?: string, agentId?: string) => void;
};

export function AgentsBuilderWrapper({
  onAskFrndOpen,
}: AgentsBuilderWrapperProps) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center px-8 py-10 text-sm text-text-inverse-subtlest">
          Loading specialist builder...
        </div>
      }
    >
      <AgentsBuilderPage onAskFrndOpen={onAskFrndOpen} />
    </Suspense>
  );
}
