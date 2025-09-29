// src/utils/actions/notifications/sendSchemeEmail.ts
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "./notifications";

const prisma = new PrismaClient();

export async function notifyUsersForNewScheme(schemeId: string) {
  // 1️⃣ Fetch scheme details
  const scheme = await prisma.scheme.findUnique({ where: { id: schemeId } });
  if (!scheme) return;

  // 2️⃣ Fetch all users
  const users = await prisma.user.findMany();

  // 3️⃣ Send emails based on state/ministry
  for (const user of users) {
    const userState = user.state?.trim().toLowerCase() || "";
    const schemeState = scheme.state?.trim().toLowerCase() || "";
    const isMinistry = schemeState.startsWith("ministry");

    if ((isMinistry || userState === schemeState) && typeof user.email === "string" && user.email) {
      const subject = isMinistry
        ? `New Scheme Available: ${scheme.name}`
        : `New Scheme in ${user.state}: ${scheme.name}`;

      const html = `
        <h2>New Scheme Available: ${scheme.name}</h2>
        <p><strong>Ministry:</strong> ${scheme.ministry || "N/A"}</p>
        <p><strong>State:</strong> ${scheme.state || "All"}</p>
        <p>Click here to view: <a href="${scheme.link}">${scheme.link}</a></p>
      `;

      try {
        await sendEmail(user.email, subject, html);
        console.log(`Email sent to ${user.email}`);
      } catch (err) {
        console.error(`Failed to send email to ${user.email}:`, err);
      }
    }
  }
}
