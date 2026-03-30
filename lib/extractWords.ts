import nlp from 'compromise';
import { STOP_WORDS } from './stopwords';

export function extractWordFrequencies(bodies: string[]): Record<string, number> {
  const freq: Record<string, number> = {};

  for (const body of bodies) {
    const doc = nlp(body);
    const phrases: string[] = doc.nouns().out('array') as string[];

    for (const phrase of phrases) {
      const normalised = phrase.toLowerCase().replace(/[^a-z\s]/g, '').trim();
      if (normalised.length < 3) continue;
      // For multi-word phrases keep as-is; for single words filter stop words
      const words = normalised.split(/\s+/);
      if (words.length === 1 && STOP_WORDS.has(words[0])) continue;
      freq[normalised] = (freq[normalised] ?? 0) + 1;
    }
  }

  return freq;
}