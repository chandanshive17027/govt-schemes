import { NextRequest, NextResponse } from "next/server";

import { execFile } from "child_process";
import path from "path";
import { auth } from "@/utils/actions/auth/auth";
import { prisma } from "@/utils/actions/database/prisma";


export async function POST(req: NextRequest, { params }: { params: { schemeId: string } }) {
  // 1️⃣ Check session
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //await params
  const schemeId = await params.schemeId; 

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        age: true,
        gender: true,
        occupation: true,
        education: true,
        castecategory: true,
        income: true,
        maritalStatus: true,
        state: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const scheme = await prisma.scheme.findUnique({
      where: { id: schemeId },
      select: { eligibility: true, tags: true, state: true },
    });

    if (!scheme) {
      return NextResponse.json({ error: "Scheme not found" }, { status: 404 });
    }

    // 2️⃣ Call Python script
    const pythonScriptPath = path.join(process.cwd(), "src/scripts/user_eligibility.py");
    const userData = JSON.stringify(user);
    const schemeData = JSON.stringify([scheme]);

    const result: string = await new Promise((resolve, reject) => {
      execFile("python3", [pythonScriptPath, userData, schemeData], (error, stdout, stderr) => {
        if (error) return reject(error);
        resolve(stdout);
      });
    });

    const parsedResult = JSON.parse(result);
    return NextResponse.json(parsedResult);
  } catch (err) {
    console.error("Eligibility check error:", err);
    return NextResponse.json({ eligible: false, reasons: ["Failed to check eligibility"] });
  }
}
