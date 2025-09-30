// src/app/api/categorized/[category]/route.ts
import { prisma } from "@/utils/actions/database/prisma";
import { NextRequest, NextResponse } from "next/server";

// Map categories to keywords
const categories: Record<string, string[]> = {
  education: ["education", "school", "college", "scholarship"],
  agriculture: ["agriculture", "farmer", "farming", "crop"],
  health: ["health", "hospital", "insurance", "medical"],
  women: ["women", "female", "girl"],
  seniorCitizen: ["senior", "elderly", "old", "retirement"],
  employment: ["employment", "job", "skill", "training"],
};

export async function GET(
  req: NextRequest,
  context: { params: { category: string } }
): Promise<NextResponse> {
  // Await the params property to correctly destructure it.
  const { category } = context.params;

  if (!categories[category]) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  try {
    const keywords = categories[category].map((k) => k.toLowerCase());

    // Fetch all schemes that have tags
    const schemes = await prisma.scheme.findMany({
      select: { id: true, name: true, link: true, tags: true },
    });

    // Filter only schemes whose tags match category keywords
    const filteredSchemes = schemes.filter((scheme) =>
      (scheme.tags || []).some((tag) => keywords.includes(tag.toLowerCase()))
    );

    return NextResponse.json({ schemes: filteredSchemes });
  } catch (err) {
    console.error("❌ Error fetching schemes for category:", err);
    return NextResponse.json({ error: "Failed to fetch schemes" }, { status: 500 });
  }
}
