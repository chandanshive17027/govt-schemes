import { auth } from "@/utils/actions/auth/auth";
import { prisma } from "@/utils/actions/database/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

export async function DELETE(request: NextRequest,
  context: { params: Promise<{ id: string }> } // Correctly type context.params as a Promise
): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.email) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const params = await context.params;
  const { id: schemeId } = params;
  if (!schemeId) {
    return new NextResponse(JSON.stringify({ error: "Scheme ID missing" }), { status: 400 });
  }

  try {
    const deletedBookmark = await prisma.userScheme.deleteMany({
      where: {
        userId: session.user.id,
        schemeId: schemeId,
      },
    });

    if (deletedBookmark.count === 0) {
      return new NextResponse(JSON.stringify({ error: "Bookmark not found" }), { status: 404 });
    }

    return new NextResponse(JSON.stringify({ message: "Bookmark deleted" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to delete bookmark" }), { status: 500 });
  }
}
