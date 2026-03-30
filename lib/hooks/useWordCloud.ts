import useSWR from 'swr';
import { WORD_COUNTS } from '@/lib/mock/words';

const KEY = '/api/words';

async function fetcher(url: string): Promise<Record<string, number>> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load word counts');
  return res.json();
}

export interface WordCloudData {
  words: Record<string, number>;
  isLoading: boolean;
  addWord: (word: string) => Promise<void>;
}

export function useWordCloud(): WordCloudData {
  const { data, mutate, isLoading } = useSWR<Record<string, number>>(KEY, fetcher, {
    fallbackData: WORD_COUNTS,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  async function addWord(word: string) {
    // Optimistic update so the cloud animates immediately
    const current = data ?? WORD_COUNTS;
    const updated = { ...current, [word]: (current[word] ?? 0) + 1 };
    await mutate(updated, { revalidate: false });

    // Fire-and-forget persistence  revalidate after so counts stay accurate
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word }),
      });
    } catch {
      // Network error  optimistic update still visible; no UX disruption
    } finally {
      // Refresh word counts from DB after a short delay
      setTimeout(() => mutate(), 2000);
    }
  }

  return {
    words: data ?? WORD_COUNTS,
    isLoading,
    addWord,
  };
}
