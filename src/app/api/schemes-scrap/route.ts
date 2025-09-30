// src/app/api/schemes-scrap/route.ts
import { notifyUsersForNewScheme } from "@/utils/actions/notifications/sendSchemeEmail";
import { PrismaClient } from "@prisma/client";
import { exec } from "child_process";
import { promisify } from "util";

const prisma = new PrismaClient();
const execAsync = promisify(exec);

export async function GET(): Promise<Response> {
  try {
    const { stdout } = await execAsync("python3 src/scripts/scraper.py", {
      maxBuffer: 1024 * 1024 * 10,
    });

    const schemes = JSON.parse(stdout);

    for (const s of schemes) {
      const newScheme = await prisma.scheme.upsert({
        where: { link: s.link },
        update: { name: s.name },
        create: { name: s.name, link: s.link },
      });

      // ✅ Notify users
      await notifyUsersForNewScheme(newScheme.id);
    }

    return new Response(
      JSON.stringify({ message: "Scraping complete", count: schemes.length }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Scraping failed:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
