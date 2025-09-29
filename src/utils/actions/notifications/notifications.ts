// src/utils/actions/notifications/notifications.ts
import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    throw new Error("Gmail credentials not set in env variables");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS, // Use App Password if 2FA is enabled
    },
  });

  const info = await transporter.sendMail({
    from: `"Gov Scheme Portal" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("Email sent:", info.messageId);
  return info;
}
