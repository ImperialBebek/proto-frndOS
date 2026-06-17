"use client";

import { AgentsProvider } from "@/context/AgentsProvider";
import { AiModeProvider } from "@/context/AiModeProvider";
import { BrandsProvider } from "@/context/BrandsProvider";
import { ChatProvider } from "@/context/ChatProvider";
import { PitchProvider } from "@/context/PitchProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AgentsProvider>
      <BrandsProvider>
        <ChatProvider>
          <AiModeProvider>
            <PitchProvider>{children}</PitchProvider>
          </AiModeProvider>
        </ChatProvider>
      </BrandsProvider>
    </AgentsProvider>
  );
}
