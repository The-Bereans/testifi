/**
 * Abbreviates text to at most `limit` characters, preferring clean sentence
 * boundaries. Appends "…" only when truncated.
 *
 * Logic:
 *  1. If text.length ≤ limit → return as-is.
 *  2. Search backwards from `limit` for the last `.`, `!`, or `?`.
 *     If the match falls within the last 40% of `limit` (i.e. ≥ limit * 0.6),
 *     cut there (inclusive) and append "…".
 *  3. Otherwise fall back to the last word boundary (space) before `limit`.
 *  4. No external dependencies.
 */
export function abbreviate(text: string, limit: number): string {
  if (text.length <= limit) return text;

  const threshold = Math.floor(limit * 0.6);

  // Search for the last sentence-ending punctuation within [0, limit]
  let lastSentence = -1;
  for (let i = limit; i >= 0; i--) {
    const ch = text[i];
    if (ch === '.' || ch === '!' || ch === '?') {
      lastSentence = i;
      break;
    }
  }

  if (lastSentence >= threshold) {
    return text.slice(0, lastSentence + 1) + '…';
  }

  // Fall back to last word boundary
  const lastSpace = text.lastIndexOf(' ', limit);
  if (lastSpace > 0) {
    return text.slice(0, lastSpace) + '…';
  }

  return text.slice(0, limit) + '…';
}
