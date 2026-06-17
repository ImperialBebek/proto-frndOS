/** Client-side helpers that call the pitch AI route handlers. */

import type { DecodedBrief } from "@/data/pitchStatic";

export type AiStatus = { configured: boolean; hasVision: boolean };

export async function fetchAiStatus(): Promise<AiStatus> {
  try {
    const res = await fetch("/api/pitch/ai-status", { cache: "no-store" });
    if (!res.ok) return { configured: false, hasVision: false };
    return (await res.json()) as AiStatus;
  } catch {
    return { configured: false, hasVision: false };
  }
}

export type DecodeInput = {
  transcript?: string;
  images?: string[];
  fileName?: string;
};

export async function decodeBrief(input: DecodeInput): Promise<DecodedBrief> {
  const res = await fetch("/api/pitch/decode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? "Decode failed");
  }
  return data.decoded as DecodedBrief;
}

export async function regenerateField(input: {
  fieldLabel: string;
  currentValue: string;
  context?: string;
}): Promise<string> {
  const res = await fetch("/api/pitch/regenerate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? "Regenerate failed");
  }
  return data.value as string;
}
