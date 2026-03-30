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
 * Uses the Web Crypto API available in Next.js edge + Node runtimes.
 */
export async function hashIp(ip: string): Promise<string> {
  const encoded = new TextEncoder().encode(ip);
  const buf = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
