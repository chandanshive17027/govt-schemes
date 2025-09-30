// src/app/api/check-eligibility/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { sendEmail } from "@/utils/actions/notifications/notifications";

const prisma = new PrismaClient();

// Helper to normalize state and check match
function isStateMatch(userState: string | undefined, schemeStates: string[] | string | undefined, schemeMinistry?: string) {
  if (!userState) return false;
  const userStateNorm = userState.trim().toLowerCase();

  const statesArr: string[] = Array.isArray(schemeStates)
    ? schemeStates
    : schemeStates
    ? [schemeStates]
    : [];

  if (statesArr.length === 0 || statesArr.map(s => s.trim().toLowerCase()).includes("all")) {
    return true;
  }

  for (const s of statesArr) {
    const sNorm = s.trim().toLowerCase();
    if (schemeMinistry && sNorm.startsWith(schemeMinistry.trim().toLowerCase())) {
      return true;
    }
    if (sNorm === userStateNorm || userStateNorm.includes(sNorm) || sNorm.includes(userStateNorm)) {
      return true;
    }
  }
  return false;
}

// Helper to run Python eligibility script
async function runPython(user: any, schemes: any[]) {
  return new Promise<any[]>((resolve, reject) => {
    try {
      const tempDir = path.join(process.cwd(), "tmp");
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

      const userFile = path.join(tempDir, `user_${Date.now()}.json`);
      const schemesFile = path.join(tempDir, `schemes_${Date.now()}.json`);

      // Pre-filter schemes based on state match like notifications
      const filteredSchemes = schemes.filter(scheme =>
        isStateMatch(user.state, scheme.state, scheme.ministry)
      );

      fs.writeFileSync(userFile, JSON.stringify(user));
      fs.writeFileSync(schemesFile, JSON.stringify(filteredSchemes));

      const py = spawn("python3", [
        path.join(process.cwd(), "src/scripts/user_eligibility.py"),
        userFile,
        schemesFile,
      ]);

      let output = "";
      let error = "";

      py.stdout.on("data", (data) => {
        output += data.toString();
      });

      py.stderr.on("data", (data) => {
        error += data.toString();
      });

      py.on("close", (code) => {
        fs.unlinkSync(userFile);
        fs.unlinkSync(schemesFile);

        if (code === 0) {
          try {
            const parsed = JSON.parse(output);
            resolve(parsed);
          } catch (e) {
            reject("Invalid JSON from Python: " + output);
          }
        } else {
          reject(error || "Python script failed");
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const schemes = await prisma.scheme.findMany();

    // Run Python with pre-filtered schemes based on state match
    const eligibleSchemes = await runPython(user, schemes);

    // Only send email if new eligible schemes exist
    if (eligibleSchemes.length > 0 && user.email) {
      const html = `
        <h2>Hi ${user.name || "User"},</h2>
        <p>Based on your profile, you are eligible for the following schemes:</p>
        <ul>
          ${eligibleSchemes
            .map((s: any) => `<li><b>${s.name}</b> - ${s.details || "No description available"}</li>`)
            .join("")}
        </ul>
        <p>Regards,<br/>Gov Scheme Portal</p>
      `;
      try {
        await sendEmail(user.email, "Your Eligible Schemes", html);
        console.log(`Eligibility email sent to ${user.email}`);
      } catch (emailErr) {
        console.error("Error sending eligibility email:", emailErr);
      }
    }

    return NextResponse.json({
      message: "Eligibility check complete. Recommendations have also been sent to email.",
      eligibleSchemes,
    });
  } catch (err: any) {
    console.error("Eligibility API Error:", err);
    return NextResponse.json(
      { error: "Eligibility check failed", details: err.toString() },
      { status: 500 }
    );
  }
}
