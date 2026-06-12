"use client";

import { Agentation } from "agentation";

/** Dev-only annotation toolbar; syncs to local agentation-mcp on :4747 */
export function AgentationDev() {
  return (
    <Agentation
      endpoint="http://localhost:4747"
      onSessionCreated={(sessionId) => {
        console.log("[agentation] session:", sessionId);
      }}
    />
  );
}
