import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "@/utils/actions/notifications/notifications";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { schemeId } = await req.json();

    if (!schemeId) {
      return NextResponse.json({ message: "schemeId is required" }, { status: 400 });
    }

    // 1️⃣ Get the new scheme
    const scheme = await prisma.scheme.findUnique({
      where: { id: schemeId },
    });

    if (!scheme) {
      return NextResponse.json({ message: "Scheme not found" }, { status: 404 });
    }

    const schemeStates = Array.isArray(scheme.state)
      ? scheme.state
      : scheme.state
      ? [scheme.state]
      : [];
    const schemeMinistry = scheme.ministry?.trim().toLowerCase();

    // 2️⃣ Fetch all users
    const users = await prisma.user.findMany();

    for (const user of users) {
      const userState = user.state?.trim().toLowerCase();

      // 3️⃣ Determine if notification should be sent
      let shouldNotify = false;

      for (const s of schemeStates) {
        const normalizedState = s.trim().toLowerCase();

        // If the state entry starts with ministry name, notify everyone
        if (schemeMinistry && normalizedState.startsWith(schemeMinistry)) {
          shouldNotify = true;
          break;
        }

        // Otherwise check if user state matches scheme state
        if (userState && normalizedState === userState) {
          shouldNotify = true;
          break;
        }
      }

      // 4️⃣ Send email if needed
      if (shouldNotify && user.email) {
        await sendEmail(
          user.email,
          `New Scheme: ${scheme.name}`,
          `
            <h3>Hi ${user.name},</h3>
            <p>A new government scheme matching your preferences has been added:</p>
            <p><strong>${scheme.name}</strong></p>
            <p>Ministry: ${scheme.ministry || "N/A"}<br/>
               Applicable States: ${schemeStates.join(", ") || "All States"}</p>
            <p><a href="${scheme.link || "#"}">View Scheme Details</a></p>
            <p>Regards,<br/>Gov Scheme Portal</p>
          `
        );
      }
    }

    return NextResponse.json({ message: "Notifications sent successfully" });
  } catch (err) {
    console.error("Error sending notifications:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
