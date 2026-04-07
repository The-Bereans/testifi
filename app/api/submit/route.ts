import { NextRequest, NextResponse } from 'next/server';
import { submissionSchema } from '@/lib/sanitize';
import { checkRateLimit, hashIp } from '@/lib/rateLimit';
import { createServiceClient } from '@/lib/supabase';

// Minimum seconds a user must wait between submissions
const SUBMISSION_COOLDOWN_S = 30;
// How far back to check for duplicate content from the same IP
const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(req: NextRequest) {
  // ── Rate limit ────────────────────────────────────────────────────────────
  const rawIp =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';
  const ipHash = await hashIp(rawIp);

  // Fast in-memory burst guard (same instance, back-to-back hits)
  const rl = checkRateLimit(`submit:${ipHash}`, { limit: 1, windowMs: SUBMISSION_COOLDOWN_S * 1000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Please wait ${SUBMISSION_COOLDOWN_S} seconds before submitting again.` },
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

  const { word, consented, category, testimonyType } = parsed.data;

  // ── Duplicate content check ───────────────────────────────────────────────
  try {
    const db = createServiceClient();
    const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
    const { count, error: dupErr } = await db
      .from('testimonies')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .eq('word', word)
      .gte('created_at', since);

    if (dupErr) throw dupErr;

    if ((count ?? 0) > 0) {
      return NextResponse.json(
        { error: 'You already submitted this testimony recently.' },
        { status: 409 }
      );
    }
  } catch (err) {
    console.error('[/api/submit] duplicate check failed', err);
    // fail open — don't block legitimate users if the check errors
  }

  // ── Persist ───────────────────────────────────────────────────────────────
  try {
    const db = createServiceClient();

    const { error: testimonyErr } = await db.from('testimonies').insert({
      word,
      consented: consented ?? false,
      ip_hash: ipHash,
      testimony_type: testimonyType ?? 'salvation',
      ...(category ? { category } : {}),
    });
    if (testimonyErr) throw testimonyErr;

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('[/api/submit]', err);
    return NextResponse.json({ error: 'Failed to save. Please try again.' }, { status: 500 });
  }
}
