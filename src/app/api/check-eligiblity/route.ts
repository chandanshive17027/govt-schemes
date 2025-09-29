import { auth } from "@/utils/actions/auth/auth";
import { PrismaClient } from "@prisma/client";
import { spawn } from "child_process";


const prisma = new PrismaClient();

/**
 * Run Python eligibility checker
 */
function runPython(user: object, scheme: object): Promise<boolean> {
  return new Promise((resolve) => {
    const py = spawn("python3", [
      "src/scripts/user_eligibility.py",
      JSON.stringify(user),
      JSON.stringify(scheme),
    ]);

    let output = "";
    let errorOutput = "";

    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    py.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    py.on("close", (code) => {
      if (code !== 0) {
        console.error("❌ Python script error:", errorOutput);
        return resolve(false);
      }
      try {
        const result = JSON.parse(output.trim());
        resolve(result.eligible ?? false);
      } catch (err) {
        console.error("⚠️ Failed to parse eligibility result:", output);
        resolve(false);
      }
    });
  });
}

export async function POST() {
  try {
    // 1️⃣ Get logged-in user from session
    const session = await auth();
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // 2️⃣ Fetch schemes (skip Prisma JSON filter, filter in JS)
    const schemesRaw = await prisma.scheme.findMany({
      select: {
        id: true,
        eligible: true,
        state: true,
        ministry: true,
        name: true,
        link: true,
      },
    });

    const schemes = schemesRaw.filter(
      (s) => Array.isArray(s.eligible) && s.eligible.length > 0
    );

    // 3️⃣ Check eligibility
    const eligibleSchemes: string[] = [];

    for (const scheme of schemes) {
      const isEligible = await runPython(user, scheme.eligible);

      if (isEligible) {
        eligibleSchemes.push(scheme.id);
      }
    }

    // 4️⃣ Update user’s eligibleSchemes
    await prisma.user.update({
      where: { id: user.id },
      data: { eligibleSchemes },
    });

    return new Response(
      JSON.stringify({
        message: "Eligibility checked successfully",
        eligibleSchemes,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error checking eligibility:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
