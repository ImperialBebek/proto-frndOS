export type QuickBriefPhrase = {
  text: string;
  pauseAfter: number;
  charStagger: number;
};

/** Pause after phrase based on trailing punctuation (seconds). */
export function getPauseAfterPhrase(phrase: string): number {
  const trimmed = phrase.trimEnd();
  if (trimmed.endsWith(".")) return 0.38;
  if (trimmed.endsWith("?") || trimmed.endsWith("!")) return 0.34;
  if (trimmed.endsWith(",")) return 0.2;
  if (trimmed.endsWith(":") || trimmed.endsWith(";")) return 0.24;
  return 0.1;
}

/** Per-character stagger for typewriter cadence (seconds). */
export function getCharStagger(char: string): number {
  if (char === " ") return 0.014;
  if (",.;:?!".includes(char)) return 0.032;
  return 0.026;
}

/** Split copy into natural phrase chunks at punctuation boundaries. */
export function splitIntoPhrases(text: string): QuickBriefPhrase[] {
  const segments = text
    .split(/(?<=[,.\:;!?])\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (segments.length === 0) {
    return [{ text, pauseAfter: 0.1, charStagger: 0.026 }];
  }

  return segments.map((segment, index) => {
    const isLast = index === segments.length - 1;
    const phraseText = isLast ? segment : `${segment} `;
    const avgStagger =
      phraseText.split("").reduce((sum, c) => sum + getCharStagger(c), 0) /
      Math.max(phraseText.length, 1);

    return {
      text: phraseText,
      pauseAfter: getPauseAfterPhrase(segment),
      charStagger: avgStagger,
    };
  });
}
