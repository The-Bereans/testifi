import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

import { waitlistSchema } from "@/lib/sanitize";
import { checkRateLimitWithDb, hashIp } from "@/lib/rateLimit";
import { prisma } from "@/lib/prisma";

const RATE_LIMIT = {
  limit: 3,
  windowMs: 60 * 60 * 1000,
};

export async function POST(req: NextRequest) {
  const rawIp =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const ipHash = hashIp(rawIp);

  const rl = await checkRateLimitWithDb(
    `waitlist:${ipHash}`,
    RATE_LIMIT
  );

  if (!rl.allowed) {
    return NextResponse.json(
      {
        error:
          "Too many requests. Try again later.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
      }
    );
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid JSON.",
      },
      {
        status: 400,
      }
    );
  }

  const parsed =
    waitlistSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ??
          "Invalid input.",
      },
      {
        status: 422,
      }
    );
  }

  const { email } = parsed.data;

  try {
    await prisma.waitlist.create({
      data: {
        id: crypto.randomUUID(),
        email,
        ip_hash: ipHash,
      },
    });

    return NextResponse.json(
      { ok: true },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { ok: true },
        { status: 201 }
      );
    }

    console.error(
      "[/api/waitlist]",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to sign up. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}