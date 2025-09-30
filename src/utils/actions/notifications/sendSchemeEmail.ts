import { PrismaClient } from "@prisma/client";
import { sendEmail } from "@/utils/actions/notifications/notifications";

const prisma = new PrismaClient();

/**
 * Notify all eligible users about a new scheme.
 * @param schemeId string
 */
export async function notifyUsersForNewScheme(schemeId: string) {
  try {
    // 1️⃣ Get the scheme details
    const scheme = await prisma.scheme.findUnique({
      where: { id: schemeId },
    });

    if (!scheme) {
      console.error("Scheme not found for ID:", schemeId);
      return;
    }

    // Normalize scheme states
    const schemeStates = Array.isArray(scheme.state)
      ? scheme.state
      : scheme.state
      ? [scheme.state]
      : [];
    const schemeStatesNorm = schemeStates.map((s) => s.trim().toLowerCase());

    // 2️⃣ Fetch all users
    const users = await prisma.user.findMany();

    // 3️⃣ Loop through users and check eligibility
    for (const user of users) {
      if (!user.email) continue;

      const userState = user.state?.trim().toLowerCase();

      let shouldNotify = false;

      // Rule: Notify if scheme is for "all" states
      if (schemeStatesNorm.length === 0 || schemeStatesNorm.includes("all")) {
        shouldNotify = true;
      }

      // Rule: Notify if user’s state matches one of scheme’s states
      if (userState && schemeStatesNorm.includes(userState)) {
        shouldNotify = true;
      }

      // 4️⃣ Send email if eligible
      if (shouldNotify) {
        await sendEmail(
          user.email,
          `New Scheme Available: ${scheme.name}`,
          `
            <h3>Hi ${user.name || "User"},</h3>
            <p>A new government scheme has been added that matches your profile:</p>
            <p><strong>${scheme.name}</strong></p>
            <p>
              Ministry: ${scheme.ministry || "N/A"}<br/>
              Applicable States: ${
                schemeStates.length > 0 ? schemeStates.join(", ") : "All States"
              }
            </p>
            <p>
              <a href="${scheme.link || "#"}" target="_blank">View Scheme Details</a>
            </p>
            <p>Regards,<br/>Gov Scheme Portal</p>
          `
        );
        console.log(`✅ Email sent to ${user.email} for scheme ${scheme.name}`);
      }
    }
  } catch (err) {
    console.error("Error in notifyUsersForNewScheme:", err);
  } finally {
    await prisma.$disconnect();
  }
}
