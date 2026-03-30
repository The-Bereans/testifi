import { STOP_WORDS } from './stopwords';

export function extractWordFrequencies(bodies: string[]): Record<string, number> {
  const freq: Record<string, number> = {};

  for (const body of bodies) {
    const tokens = body
      .toLowerCase()
      .replace(/[^a-z\s]/g, ' ')
      .split(/\s+/);

    for (const token of tokens) {
      if (token.length < 3 || STOP_WORDS.has(token)) continue;
      freq[token] = (freq[token] ?? 0) + 1;
    }
  }

  return freq;
}