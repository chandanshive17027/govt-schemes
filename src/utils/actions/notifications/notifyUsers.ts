// src/utils/actions/notifyUsers.ts

import SendmailTransport from "nodemailer/lib/sendmail-transport";
import { isUserEligibleForScheme } from "../eligibility/checkEligibility";
import { prisma } from "../database/prisma";
import { sendEmail } from "./notifications";


export async function notifyEligibleUsersForScheme(schemeId: string) {
  // 1️⃣ Fetch scheme
  const scheme = await prisma.scheme.findUnique({ where: { id: schemeId } });
  if (!scheme) return;

  // 2️⃣ Fetch all users
  const users = await prisma.user.findMany();

  // 3️⃣ Loop through users
  for (const user of users) {
    // Check eligibility
    const eligible = await isUserEligibleForScheme(user, scheme);
    if (!eligible) continue;

    // Prepare email content
    const subject = `New Government Scheme: ${scheme.name}`;
    const message = `
      Hello ${user.name || ""},<br/><br/>
      You are eligible for a new government scheme: <strong>${scheme.name}</strong>.<br/>
      <a href="${scheme.link}" target="_blank">Click here to know more</a>.<br/><br/>
      Regards,<br/>
      Your Government Scheme Portal
    `;

    // Send email if user has email
    if (user.email) {
      try {
        await sendEmail(user.email, subject, message);
        console.log(`✅ Email sent to ${user.email} for scheme: ${scheme.name}`);
      } catch (err) {
        console.error(`❌ Failed to send email to ${user.email}:`, err);
      }
    }
  }
}
