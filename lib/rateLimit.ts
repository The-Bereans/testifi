import crypto from 'node:crypto';
import { prisma } from '@/lib/prisma';

/**
 * In-memory sliding-window rate limiter.
 * Suitable for single-instance deployments (Vercel Serverless, Netlify Functions).
 * For multi-instance deployments replace the store with Redis / Upstash.
 */

interface Window {
  count:  number;
  resetAt: number; // unix ms
}

const store = new Map<string, Window>();

export interface RateLimitOptions {
  /** Max requests allowed per window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed:    boolean;
  remaining:  number;
  resetAt:    number;
}

/**
 * Check (and increment) the rate-limit counter for a given key.
 *
 * @param key       typically the hashed IP address
 * @param options   { limit, windowMs }
 */
export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    // New window
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, remaining: options.limit - 1, resetAt: now + options.windowMs };
  }

  if (entry.count >= options.limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: options.limit - entry.count, resetAt: entry.resetAt };
}

/**
 * SHA-256 hash of the raw IP so we never store PII.
 * Uses Node's built-in crypto module (Node.js runtime compatible).
 */
export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

/**
 * DB-backed rate-limit check with in-memory fallback.
 * Uses the `rate_limits` table so limits survive serverless cold starts.
 * Falls back to the in-memory store if the DB is unreachable.
 */
export async function checkRateLimitWithDb(
  key: string,
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  const colonIdx = key.indexOf(':');
  const action = key.slice(0, colonIdx);
  const ipHash = key.slice(colonIdx + 1);

  try {
    return await prisma.$transaction(async (tx) => {
      const now = new Date();

      const record = await tx.rate_limits.findFirst({
        where: {
          ip_hash: ipHash,
          action: action,
          expires_at: { gt: now },
        },
        orderBy: { expires_at: 'desc' },
      });

      if (!record) {
        await tx.rate_limits.create({
          data: {
            id: crypto.randomUUID(),
            ip_hash: ipHash,
            action: action,
            count: 1,
            window_start: now,
            expires_at: new Date(now.getTime() + options.windowMs),
          },
        });
        return { allowed: true, remaining: options.limit - 1, resetAt: Date.now() + options.windowMs };
      }

      if (record.count >= options.limit) {
        return { allowed: false, remaining: 0, resetAt: record.expires_at.getTime() };
      }

      await tx.rate_limits.update({
        where: { id: record.id },
        data: { count: { increment: 1 } },
      });

      return { allowed: true, remaining: options.limit - record.count - 1, resetAt: record.expires_at.getTime() };
    });
  } catch (err) {
    console.warn('[rateLimit] DB unavailable, falling back to in-memory', err);
    return checkRateLimit(key, options);
  }
}
