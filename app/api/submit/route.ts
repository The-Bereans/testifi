import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { checkRateLimitWithDb, hashIp } from "@/lib/rateLimit";
import { submissionSchema } from "@/lib/sanitize";

const RATE_LIMIT = {
  limit: 5,
  windowMs: 60 * 60 * 1000,
};

export async function POST(req: NextRequest) {
  const rawIp =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const ipHash = hashIp(rawIp);

  const rl = await checkRateLimitWithDb(`submit:${ipHash}`, RATE_LIMIT);

  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  try {
    const body = await req.json();

    const parsed = submissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid submission." },
        { status: 422 }
      );
    }

    const { title, body: testimonyBody, categoryId, consented, isIdentityHidden } = parsed.data;

    const testimony = await prisma.testimonies.create({
      data: {
        id: crypto.randomUUID(),
        title,
        body: testimonyBody,
        consented,
        is_identity_hidden: isIdentityHidden,
        status: "published",
        category_id: categoryId ?? null,
        excerpt:
          testimonyBody.length > 240
            ? `${testimonyBody.slice(0, 240)}...`
            : testimonyBody,
      },
      include: { categories: true },
    });

    return NextResponse.json(testimony, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[/api/submit]", err);
    return NextResponse.json(
      { error: "Something went wrong while submitting your testimony." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
