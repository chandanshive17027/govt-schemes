// src/app/api/schemes/ai-recommendations/route.ts
import { prisma } from "@/utils/actions/database/prisma";
import { auth } from "@/utils/actions/auth/auth";
import { generateSummary } from "@/utils/ai/generateContent";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1️⃣ Fetch user
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 2️⃣ Fetch all schemes
    const allSchemes = await prisma.scheme.findMany();
    if (!allSchemes.length) return NextResponse.json({ schemes: [], message: "No schemes in database" });

    const eligibleSchemes: typeof allSchemes = [];

    for (const scheme of allSchemes) {
      const isCentral = scheme.ministry?.startsWith("Ministry");

      // State check
      if (!isCentral) {
        if (!scheme.state || scheme.state.toLowerCase() !== user.state?.toLowerCase()) continue;
      }

      // Construct prompt to Gemini to check if user is eligible
      const userPrompt = `
        You are a government scheme eligibility checker.
        User details:
        Age: ${user.age || "N/A"}
        Gender: ${user.gender || "N/A"}
        Education: ${user.education || "N/A"}
        Occupation: ${user.occupation || "N/A"}
        Income: ${user.income || "N/A"}
        Caste Category: ${user.castecategory || "N/A"}
        State: ${user.state || "N/A"}

        Scheme details:
        Name: ${scheme.name}
        Eligibility: ${scheme.eligibility || ""}
        Details: ${scheme.details || ""}

        Answer "YES" if the user is eligible for this scheme, otherwise "NO".
        Return only "YES" or "NO".
      `;

      try {
        const result = await generateSummary(userPrompt);
        if (result.trim().toUpperCase() === "YES") {
          eligibleSchemes.push(scheme);
        }
      } catch (err) {
        console.error(`Error checking eligibility for scheme ${scheme.name}:`, err);
      }
    }

    return NextResponse.json({ schemes: eligibleSchemes });
  } catch (err) {
    console.error("AI Recommendation Error:", err);
    return NextResponse.json({ error: "Failed to generate AI recommendations" }, { status: 500 });
  }
}
