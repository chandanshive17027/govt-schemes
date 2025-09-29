import { prisma } from "@/utils/actions/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const schemes = await prisma.scheme.findMany();

    if (!schemes || schemes.length === 0) {
      return NextResponse.json({ error: "No schemes found" }, { status: 404 });
    }

    // ✅ Count fully fetched schemes
    const fullyFetchedCount = schemes.filter(
      (s) =>
        s.name &&
        s.link &&
        s.details &&
        s.application_process &&
        s.eligibility
    ).length;

    console.log(`Fetched ${schemes.length} schemes from database.`);
    console.log(`Fully fetched schemes: ${fullyFetchedCount}`);

    return NextResponse.json(schemes);
  } catch (error) {
    console.error("Error fetching schemes:", error);
    return new Response("Error fetching schemes", { status: 500 });
  }
}
