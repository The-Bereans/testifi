import { NextRequest, NextResponse } from 'next/server';
import { submissionSchema } from '@/lib/sanitize';
import { checkRateLimit, hashIp } from '@/lib/rateLimit';
import { createServiceClient } from '@/lib/supabase';

// 10 submissions per IP per hour
const RATE_LIMIT = { limit: 10, windowMs: 60 * 60 * 1000 };

export async function POST(req: NextRequest) {
  // ── Rate limit ────────────────────────────────────────────────────────────
  const rawIp =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';
  const ipHash = await hashIp(rawIp);
  const rl = checkRateLimit(`submit:${ipHash}`, RATE_LIMIT);

  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many submissions. Try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
      }
    );
  }

  // ── Parse & validate ──────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input.' },
      { status: 422 }
    );
  }

  const { word, body: testimonyBody, consented, category } = parsed.data;

  // ── Persist ───────────────────────────────────────────────────────────────
  try {
    const db = createServiceClient();

    // Atomic word count increment via DB function
    const { error: countErr } = await db.rpc('increment_word_count', { p_word: word });
    if (countErr) throw countErr;

    // Store full testimony only if provided
    if (testimonyBody) {
      const { error: testimonyErr } = await db.from('testimonies').insert({
        word,
        body: testimonyBody,
        consented: consented ?? false,
        ip_hash: ipHash,
        ...(category ? { category } : {}),
      });
      if (testimonyErr) throw testimonyErr;
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('[/api/submit]', err);
    return NextResponse.json({ error: 'Failed to save. Please try again.' }, { status: 500 });
  }
}
