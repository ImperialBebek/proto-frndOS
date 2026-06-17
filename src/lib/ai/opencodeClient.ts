/** Server-only OpenAI-compatible client for the OpenCode gateway. */

import { getAiConfig } from "./aiConfig";

export type ChatContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string | ChatContentPart[];
};

export type ChatOptions = {
  /** Override the default model (e.g. the vision model) */
  model?: string;
  /** Ask the gateway for a JSON object response */
  json?: boolean;
  temperature?: number;
};

/** Calls the gateway's /chat/completions endpoint and returns message text. */
export async function chatComplete(
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<string> {
  const config = getAiConfig();
  if (!config) {
    throw new Error("AI gateway is not configured (missing OPENCODE_API_KEY).");
  }

  const body: Record<string, unknown> = {
    model: options.model ?? config.model,
    messages,
    temperature: options.temperature ?? 0.7,
  };
  if (options.json) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const hint =
      res.status === 404 && config.baseUrl.includes("/go/")
        ? " Check OPENCODE_BASE_URL — use https://opencode.ai/zen/v1 for OpenCode Zen."
        : res.status === 404 && detail.trimStart().startsWith("<!")
          ? " Gateway returned HTML (likely wrong OPENCODE_BASE_URL)."
          : "";
    throw new Error(
      `AI gateway request failed (${res.status}): ${detail.slice(0, 400)}${hint}`
    );
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content ?? "";
}

/** Parse a JSON object from a model response, tolerating ```json fences. */
export function parseJsonResponse<T>(raw: string): T {
  let text = raw.trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1].trim();
  // Fall back to the first {...} block if extra prose surrounds it.
  if (!text.startsWith("{")) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1) text = text.slice(start, end + 1);
  }
  return JSON.parse(text) as T;
}
