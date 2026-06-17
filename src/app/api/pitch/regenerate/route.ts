import { NextResponse } from "next/server";
import { getAiConfig } from "@/lib/ai/aiConfig";
import { chatComplete, parseJsonResponse } from "@/lib/ai/opencodeClient";
import {
  REGENERATE_SYSTEM_PROMPT,
  buildRegenerateUserPrompt,
} from "@/lib/ai/prompts";

type RegenerateRequest = {
  fieldLabel: string;
  currentValue: string;
  context?: string;
};

export async function POST(req: Request) {
  const config = getAiConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Real AI is not configured on the server." },
      { status: 503 }
    );
  }

  let body: RegenerateRequest;
  try {
    body = (await req.json()) as RegenerateRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.fieldLabel || typeof body.currentValue !== "string") {
    return NextResponse.json(
      { error: "fieldLabel and currentValue are required." },
      { status: 400 }
    );
  }

  try {
    const raw = await chatComplete(
      [
        { role: "system", content: REGENERATE_SYSTEM_PROMPT },
        { role: "user", content: buildRegenerateUserPrompt(body) },
      ],
      { json: true, temperature: 0.85 }
    );
    const { value } = parseJsonResponse<{ value: string }>(raw);
    return NextResponse.json({ value });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "AI regenerate failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
