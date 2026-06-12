export type ParsedMetricValue =
  | { type: "number"; numeric: number; useGrouping: boolean }
  | { type: "percent"; numeric: number; decimals: number }
  | { type: "text"; raw: string };

export function parseMetricValue(value: string): ParsedMetricValue {
  const trimmed = value.trim();

  if (trimmed.endsWith("%")) {
    const numeric = Number.parseFloat(trimmed.slice(0, -1));
    const fraction = trimmed.slice(0, -1).split(".")[1];
    const decimals = fraction ? fraction.length : 0;
    if (!Number.isNaN(numeric)) {
      return { type: "percent", numeric, decimals };
    }
  }

  const numeric = Number.parseFloat(trimmed.replace(/,/g, ""));
  if (!Number.isNaN(numeric)) {
    return {
      type: "number",
      numeric,
      useGrouping: trimmed.includes(","),
    };
  }

  return { type: "text", raw: value };
}

export function formatMetricValue(
  value: number,
  parsed: ParsedMetricValue
): string {
  if (parsed.type === "percent") {
    return `${value.toFixed(parsed.decimals)}%`;
  }
  if (parsed.type === "number") {
    if (parsed.useGrouping) {
      return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0,
      }).format(Math.round(value));
    }
    return String(Math.round(value));
  }
  return parsed.raw;
}
