// src/utils/actions/notifications/notifyUsers.ts
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "./notifications";

const prisma = new PrismaClient();

export async function notifyUsersAboutNewScheme(scheme: any) {
  // Fetch users from database
  const users = await prisma.user.findMany();

  for (const user of users) {
    let shouldNotify = false;

    if (scheme.state?.toLowerCase().startsWith("ministry")) {
      // Ministry schemes go to all users
      shouldNotify = true;
    } else if (
      user.state &&
      scheme.state &&
      user.state.toLowerCase() === scheme.state.toLowerCase()
    ) {
      // State match
      shouldNotify = true;
    }

    if (shouldNotify && user.email) {
      try {
        await sendEmail(
          user.email,
          `New Scheme Available: ${scheme.name}`,
          `<p>Hi ${user.name},</p>
           <p>A new scheme <strong>${scheme.name}</strong> is now available.</p>
           <p>Check it here: <a href="${process.env.NEXT_PUBLIC_BASE_URL}/scheme/${scheme.id}">${scheme.name}</a></p>
           <p>Regards, <br/>Gov Scheme Portal</p>`
        );
      } catch (err) {
        console.error(`Failed to send email to ${user.email}:`, err);
      }
    }
  }
}
