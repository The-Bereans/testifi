import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { WORD_COUNTS } from '@/lib/mock/words';
import { extractWordFrequencies } from '@/lib/extractWords';

// Cache the response for 60 s at the CDN edge
export const revalidate = 60;

const EXPLICIT_WEIGHT = 3;
const TOP_N = 150;

export async function GET() {
  try {
    const db = createServiceClient();

    // Single query: word for explicit counts, body for NLP extraction.
    const { data: rows, error } = await db
      .from('testimonies')
      .select('word, body')
      .limit(5000);

    if (error) throw error;

    // Count explicit submissions per word (replaces word_counts).
    const wordCountMap: Record<string, number> = {};
    const bodies: string[] = [];
    for (const row of rows ?? []) {
      wordCountMap[row.word] = (wordCountMap[row.word] ?? 0) + 1;
      if (row.body) bodies.push(row.body);
    }

    const nlpFreq = extractWordFrequencies(bodies);

    const merged: Record<string, number> = { ...nlpFreq };
    for (const [word, count] of Object.entries(wordCountMap)) {
      merged[word] = (merged[word] ?? 0) + count * EXPLICIT_WEIGHT;
    }

    const result = Object.fromEntries(
      Object.entries(merged)
        .sort(([, a], [, b]) => b - a)
        .slice(0, TOP_N),
    );

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (err) {
    console.error('[/api/words]', err);
    // Graceful degradation  return mock data so the UI never breaks
    return NextResponse.json(WORD_COUNTS, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}