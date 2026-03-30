import { NextRequest, NextResponse } from 'next/server';
import { waitlistSchema } from '@/lib/sanitize';
import { checkRateLimit, hashIp } from '@/lib/rateLimit';
import { createServiceClient } from '@/lib/supabase';

// 3 attempts per IP per hour (prevent email enumeration)
const RATE_LIMIT = { limit: 3, windowMs: 60 * 60 * 1000 };

export async function POST(req: NextRequest) {
  // ── Rate limit ────────────────────────────────────────────────────────────
  const rawIp =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';
  const ipHash = await hashIp(rawIp);
  const rl = checkRateLimit(`waitlist:${ipHash}`, RATE_LIMIT);

  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429 }
    );
  }

  // ── Parse & validate ──────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input.' },
      { status: 422 }
    );
  }

  const { email } = parsed.data;

  // ── Persist ───────────────────────────────────────────────────────────────
  try {
    const db = createServiceClient();

    const { error } = await db.from('waitlist').insert({ email, ip_hash: ipHash });

    // Unique constraint violation — silently succeed (don't reveal existing emails)
    if (error && error.code !== '23505') throw error;

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('[/api/waitlist]', err);
    return NextResponse.json({ error: 'Failed to sign up. Please try again.' }, { status: 500 });
  }
}
