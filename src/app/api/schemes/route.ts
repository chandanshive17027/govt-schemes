import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(_: NextRequest) {
  try {
    const schemes = await prisma.scheme.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(schemes);
  } catch (err: unknown) {
    console.error("❌ Failed to fetch schemes:", err);

    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
