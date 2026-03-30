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

    const [{ data: wordCountRows, error: wcError }, { data: testimonyRows, error: tError }] =
      await Promise.all([
        db.from('word_counts').select('word, count').order('count', { ascending: false }).limit(2000),
        db.from('testimonies').select('body').limit(2000),
      ]);

    if (wcError) throw wcError;
    if (tError) throw tError;

    const bodies = (testimonyRows ?? []).map((r) => r.body ?? '');
    const nlpFreq = extractWordFrequencies(bodies);

    const merged: Record<string, number> = { ...nlpFreq };
    for (const row of wordCountRows ?? []) {
      merged[row.word] = (merged[row.word] ?? 0) + row.count * EXPLICIT_WEIGHT;
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