"use client";

import { AgentsProvider } from "@/context/AgentsProvider";
import { ChatProvider } from "@/context/ChatProvider";
import { PitchProvider } from "@/context/PitchProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AgentsProvider>
      <ChatProvider>
        <PitchProvider>{children}</PitchProvider>
      </ChatProvider>
    </AgentsProvider>
  );
}
