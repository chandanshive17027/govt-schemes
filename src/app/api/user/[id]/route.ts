// API route to fetch user by ID
//src/app/api/user/[id]/route.ts
import { auth } from "@/utils/actions/auth/auth";
import { prisma } from "@/utils/actions/database/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest,
  context: { params: Promise<{ id: string }> } // Correctly type context.params as a Promise
): Promise<NextResponse> {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
      });
    }
  const params = await context.params;
  const { id } = params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
