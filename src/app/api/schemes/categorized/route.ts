import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Define categories and their matching keywords
const categories: Record<string, string[]> = {
  education: ["education", "school", "college", "scholarship"],
  agriculture: ["agriculture", "farmer", "farming", "crop"],
  health: ["health", "hospital", "insurance", "medical"],
  women: ["women", "female", "girl"],
  seniorCitizen: ["senior", "elderly", "old", "retirement"],
  employment: ["employment", "job", "skill", "training"]
};

export async function GET() {
  try {
    // 1️⃣ Fetch all schemes with tags
    const schemes = await prisma.scheme.findMany({
      select: {
        id: true,
        name: true,
        link: true,
        tags: true
      }
    });

    // 2️⃣ Categorize schemes
    const categorized: Record<string, typeof schemes> = {
      education: [],
      agriculture: [],
      health: [],
      women: [],
      seniorCitizen: [],
      employment: []
    };

    schemes.forEach((scheme) => {
      const schemeTags = (scheme.tags || []).map((t) => t.toLowerCase());

      for (const [category, keywords] of Object.entries(categories)) {
        if (schemeTags.some((tag) => keywords.includes(tag))) {
          categorized[category].push(scheme);
        }
      }
    });

    // 3️⃣ Return response
    return NextResponse.json({ categorized });
  } catch (err) {
    console.error("❌ Error fetching categorized schemes:", err);
    return NextResponse.json(
      { error: "Failed to fetch categorized schemes" },
      { status: 500 }
    );
  }
}
