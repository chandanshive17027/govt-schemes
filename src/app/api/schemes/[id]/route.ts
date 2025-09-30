import { auth } from "@/utils/actions/auth/auth";
import { prisma } from "@/utils/actions/database/prisma";
import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { toast } from "sonner";

export async function GET( req: NextRequest, { params }: { params: { id: string } }) {
  const {id} = await params;
  try {
    const scheme = await prisma.scheme.findUnique({
      where: { id },
    });

    if (!scheme) return NextResponse.json({ message: "Scheme not found" }, { status: 404 });

    return NextResponse.json(scheme);
  } catch (error) {
    console.error("❌ Error fetching scheme:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // Correctly type context.params as a Promise
): Promise<NextResponse> {
  try {
    // 1️⃣ Check if user is logged in
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    // 2️⃣ Fetch user from DB
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const params = await context.params; // get scheme ID from URL
    const { id } = params;

    // 3️⃣ Fetch scheme by ID
    const scheme = await prisma.scheme.findUnique({
      where: { id: id },
      select: { id: true, name: true, tags: true, eligible: true, state: true },
    });

    if (!scheme) {
      return NextResponse.json({ error: "Scheme not found" }, { status: 404 });
    }

    // 4️⃣ Run Python script
    const pythonResult: { eligible: boolean; reasons: string[] } = await new Promise((resolve) => {
      const py = spawn("python3", [
        "src/scripts/user_eligibility.py",
        JSON.stringify(user),
        JSON.stringify(scheme.eligible)
      ]);

      let output = "";
      let errorOutput = "";

      py.stdout.on("data", (data) => { output += data.toString(); });
      py.stderr.on("data", (data) => { errorOutput += data.toString(); });

      py.on("close", (code) => {
        if (code !== 0) {
          console.error("❌ Python script error:", errorOutput);
          return resolve({ eligible: false, reasons: ["Python script failed"] });
        }
        try {
          const result = JSON.parse(output.trim());
          resolve(result);
        } catch (err: unknown) {
      // Safely check if `err` is an instance of `Error`
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("❌ An unexpected error occurred.");
      }
    }
      });
    });

    // 5️⃣ Optional: check state constraints
    if (scheme.state && user.state && !scheme.state.includes(user.state)) {
      pythonResult.eligible = false;
      const stateList = Array.isArray(scheme.state) ? scheme.state.join(", ") : scheme.state;
      pythonResult.reasons.push(`Applicable only for state(s): ${stateList}`);
    }

    return NextResponse.json(pythonResult);
  } catch (error) {
    console.error("❌ Error in eligibility check:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,          // first param is request
  { params }: { params: { id: string } } // second param is context with params
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "Invalid scheme id" }, { status: 400 });
  }

  try {
    const deletedScheme = await prisma.scheme.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Scheme deleted successfully",
      scheme: deletedScheme,
    });
  } catch (err: unknown) {
      // Safely check if `err` is an instance of `Error`
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("❌ An unexpected error occurred.");
      }
    }
}

