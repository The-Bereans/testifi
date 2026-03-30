import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const category = searchParams.get('category') ?? undefined;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10)),
  );

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    const db = createServiceClient();

    let query = db
      .from('testimonies')
      .select('id, word, body, category, excerpt, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json(
      { data: data ?? [], total: count ?? 0, page },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } },
    );
  } catch (err) {
    console.error('[/api/testimonies]', err);
    return NextResponse.json({ error: 'Failed to load testimonies.' }, { status: 500 });
  }
}
