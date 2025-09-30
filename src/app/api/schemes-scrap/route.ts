// src/app/api/schemes-scrap/route.ts
import { notifyUsersForNewScheme } from "@/utils/actions/notifications/sendSchemeEmail";
import { PrismaClient } from "@prisma/client";
import { exec } from "child_process";

const prisma = new PrismaClient();

export async function GET() {
  return new Promise((resolve) => {
    exec("python3 src/scripts/scraper.py", { maxBuffer: 1024 * 1024 * 10 }, async (error, stdout) => {
      if (error) return resolve(new Response(JSON.stringify({ error: error.message }), { status: 500 }));

      try {
        const schemes = JSON.parse(stdout);

        for (const s of schemes) {
          const newScheme = await prisma.scheme.upsert({
            where: { link: s.link },
            update: { name: s.name },
            create: { name: s.name, link: s.link },
          });

          // ✅ Notify users for each new or updated scheme
          await notifyUsersForNewScheme(newScheme.id);
        }

        resolve(new Response(JSON.stringify({ message: "Scraping complete", count: schemes.length }), { status: 200 }));
      } catch (error) {
        console.error("❌ Failed to parse scraper output:", error);
      }
    });
  });
}
