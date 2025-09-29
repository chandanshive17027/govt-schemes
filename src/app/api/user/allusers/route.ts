import { prisma } from "@/utils/actions/database/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch first 100 users or all if you want
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        gender: true,
      },
      take: 100, // optional limit
    });

    return NextResponse.json(users);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to fetch users" }, { status: 500 });
  }
}
