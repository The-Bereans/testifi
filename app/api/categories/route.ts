import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    console.error("[/api/categories]", err);
    return NextResponse.json(
      { error: "Failed to load categories." },
      { status: 500 }
    );
  }
}
