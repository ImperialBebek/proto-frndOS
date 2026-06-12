"use client";

import { AgentsProvider } from "@/context/AgentsProvider";
import { BrandsProvider } from "@/context/BrandsProvider";
import { ChatProvider } from "@/context/ChatProvider";
import { PitchProvider } from "@/context/PitchProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AgentsProvider>
      <BrandsProvider>
        <ChatProvider>
          <PitchProvider>{children}</PitchProvider>
        </ChatProvider>
      </BrandsProvider>
    </AgentsProvider>
  );
}
