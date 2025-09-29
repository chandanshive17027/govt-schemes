import { auth } from "@/utils/actions/auth/auth";
import { prisma } from "@/utils/actions/database/prisma";

interface Params {
  params: { id: string };
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

    const { id: schemeId } = await params;
  if (!schemeId) {
    return new Response(JSON.stringify({ error: "Scheme ID missing" }), { status: 400 });
  }

  try {
    const deletedBookmark = await prisma.userScheme.deleteMany({
      where: {
        userId: session.user.id,
        schemeId: schemeId,
      },
    });

    if (deletedBookmark.count === 0) {
      return new Response(JSON.stringify({ error: "Bookmark not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Bookmark deleted" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return new Response(JSON.stringify({ error: "Failed to delete bookmark" }), { status: 500 });
  }
}
