import { NextResponse } from "next/server";
import { getAiConfig, isAiConfigured } from "@/lib/ai/aiConfig";

/** Tells the client whether real AI is available, so the UI can offer the
 *  mock/real toggle (real is disabled when no key is configured). */
export function GET() {
  const config = getAiConfig();
  return NextResponse.json({
    configured: isAiConfigured(),
    hasVision: Boolean(config),
  });
}
