import {
  NextRequest,
  NextResponse,
} from "next/server";

import { prisma } from "@/lib/prisma";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export async function GET(
  req: NextRequest
) {
  const { searchParams } =
    req.nextUrl;

  const categorySlug =
    searchParams.get("category") ??
    undefined;

  const page = Math.max(
    1,
    parseInt(
      searchParams.get("page") ?? "1",
      10
    )
  );

  const limit = Math.min(
    MAX_LIMIT,
    Math.max(
      1,
      parseInt(
        searchParams.get("limit") ??
          String(DEFAULT_LIMIT),
        10
      )
    )
  );

  const skip =
    (page - 1) * limit;

  try {
    const where = categorySlug
      ? {
          categories: {
            slug: categorySlug,
          },
          status: "published" as const,
        }
      : {
          status: "published" as const,
        };

    const [data, total] =
      await Promise.all([
        prisma.testimonies.findMany({
          where,
          orderBy: {
            created_at: "desc",
          },
          skip,
          take: limit,
          include: {
            categories: true,
          },
        }),

        prisma.testimonies.count({
          where,
        }),
      ]);

    return NextResponse.json(
      {
        data,
        total,
        page,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (err) {
    console.error(
      "[/api/testimonies]",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to load testimonies.",
      },
      {
        status: 500,
      }
    );
  }
}
