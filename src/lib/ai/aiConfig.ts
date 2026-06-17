/** Server-only AI gateway configuration.
 *  Real AI runs through an OpenAI-compatible OpenCode gateway. The prototype
 *  stays fully functional in mock mode when no key is configured. */

/** Strip inline `#` comments and whitespace from env values. */
function envValue(raw: string | undefined): string {
  if (!raw) return "";
  const hash = raw.indexOf("#");
  const value = hash === -1 ? raw : raw.slice(0, hash);
  return value.trim();
}

export type AiConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
  /** Optional vision-capable model for image-PDF uploads (defaults to main model) */
  visionModel: string;
};

/** Returns the configured gateway, or null when no API key is set (mock-only). */
export function getAiConfig(): AiConfig | null {
  const apiKey = envValue(process.env.OPENCODE_API_KEY);
  if (!apiKey) return null;

  const baseUrl = (
    envValue(process.env.OPENCODE_BASE_URL) || "https://opencode.ai/zen/v1"
  ).replace(/\/+$/, "");
  const model = envValue(process.env.OPENCODE_MODEL) || "minimax-m2.7";
  const visionModel = envValue(process.env.OPENCODE_VISION_MODEL) || model;

  return { apiKey, baseUrl, model, visionModel };
}

/** Model used when decoding image-only briefs (falls back to the main model). */
export function getVisionModel(config: AiConfig): string {
  return config.visionModel ?? config.model;
}

export function isAiConfigured(): boolean {
  return Boolean(envValue(process.env.OPENCODE_API_KEY));
}
