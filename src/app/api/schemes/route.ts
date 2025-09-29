import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const schemes = await prisma.scheme.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(schemes);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch schemes" }, { status: 500 });
  }
}
