import { auth } from "@/utils/actions/auth/auth";
import { prisma } from "@/utils/actions/database/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const bookmarks = await prisma.userScheme.findMany({
      where: { userId: session.user.id },
      include: { scheme: true }, // include scheme details
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch bookmarks" }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  try {
    const { schemeId } = await req.json();
    if (!schemeId) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
      });
    }

    const bookmark = await prisma.userScheme.create({
      data: {
        user: { connect: { id: session.user.id } },
        scheme: { connect: { id: schemeId } },
      },
    });
    return new Response(JSON.stringify(bookmark), { status: 201 });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create bookmark" }),
      { status: 500 }
    );
  }
}
