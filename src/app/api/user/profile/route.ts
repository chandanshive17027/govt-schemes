// src/app/api/user/profile/route.ts
import { prisma } from "@/utils/actions/database/prisma";
import { auth } from "@/utils/actions/auth/auth";
import { NextResponse } from "next/server";
import { sendEmail } from "@/utils/actions/notifications/notifications";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await auth();

  // ✅ Accept both id and email for session validation
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  if (!userId && !userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  // ✅ Only allow whitelisted fields
  const safeData = {
    name: data.name || null,
    age: data.age ? Number(data.age) : null,
    castecategory: data.castecategory || null,
    occupation: data.occupation || null,
    income: data.income ? Number(data.income) : null,
    state: data.state || null,
    city: data.city || null,
    maritalStatus: data.maritalStatus || null,
    zipCode: data.zipCode ? Number(data.zipCode) : null,
    education: data.education || null,
    preferredLanguage: data.preferredLanguage || null,
    gender: data.gender || null,
    phoneNumber: data.phoneNumber ? Number(data.phoneNumber) : null,
  };

  try {
    const currentUser = await prisma.user.findUnique({
      where: userId ? { id: userId } : { email: userEmail! },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: safeData,
    });

    console.log(`✅ Profile updated for user: ${updatedUser.name} (${updatedUser.id})`);

    // (Eligibility + Email sending logic remains the same as your code)
    // ...

    return NextResponse.json(updatedUser);
  } catch (err: any) {
    console.error("❌ Failed to update profile:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}