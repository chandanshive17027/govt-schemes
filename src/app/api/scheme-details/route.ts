// src/app/api/scheme-details/route.ts
import { PrismaClient } from "@prisma/client";
import { exec } from "child_process";

const prisma = new PrismaClient();

export async function GET() {

  const incomplete = await prisma.scheme.count({
  where: { detailsFetched: false },
});
console.log("DB check incomplete count:", incomplete);

  // STEP 1: Fetch only incomplete schemes
  const incompleteSchemes = await prisma.scheme.findMany({
    where: { detailsFetched: false },
    select: {
      id: true,
      link: true,
      name: true, // keep as is
      details: true,
      benefits: true,
      eligibility: true,
      application_process: true,
      documents_required: true,
      state: true,
      ministry: true,
      tags: true,
      faqs: true,
      sources_and_resources: true,
    },
  });

 if (incompleteSchemes.length === 0) {
    console.log("✅ All schemes already fetched. No incomplete schemes found.");
    return new Response(
      JSON.stringify({ message: "All schemes already fetched", incompleteSchemes: 0 }),
      { status: 200 }
    );
  }


  console.log(`🟡 Found ${incompleteSchemes.length} incomplete schemes. Starting scraper...`);

  let updatedCount = 0;

  for (const s of incompleteSchemes) {
    await new Promise((resolve) => {
      exec(
        `python3 src/scripts/scraper_details.py "${s.link}"`,
        { maxBuffer: 1024 * 1024 * 10 },
        async (error, stdout) => {
          if (error) {
            console.error("❌ Error scraping:", s.link, error.message);
            return resolve(null);
          }

          try {
            const data = JSON.parse(stdout);

            // Update DB without touching name and link
            await prisma.scheme.update({
              where: { id: s.id },
              data: {
                state: data.state || s.state,
                ministry: data.ministry || s.ministry,
                tags: data.tags?.length ? data.tags : s.tags,
                details: data.details || s.details,
                benefits: data.benefit || s.benefits,
                eligibility: data.eligibility || s.eligibility,
                application_process: data.application_process || s.application_process,
                documents_required: data.documents_required || s.documents_required,
                faqs: data.faq?.length ? data.faq : s.faqs,
                sources_and_resources: data.sources_and_references?.length
                  ? data.sources_and_references
                  : s.sources_and_resources,
              },
            });

            // Check if all required fields are now populated
            const allFilled =
              (data.details || s.details) &&
              (data.benefit || s.benefits) &&
              (data.eligibility || s.eligibility) &&
              (data.application_process || s.application_process) &&
              (data.documents_required || s.documents_required);

            if (allFilled) {
              await prisma.scheme.update({
                where: { id: s.id },
                data: { detailsFetched: true },
              });
            }

            updatedCount++;
            resolve(true);
          } catch (err) {
            console.error("⚠️ Failed to parse scraper output for:", s.link);
            resolve(null);
          }
        }
      );
    });
  }

  const totalSchemes = await prisma.scheme.count();
  const fullyFetched = await prisma.scheme.count({ where: { detailsFetched: true } });

  console.log(`📊 Total schemes in DB: ${totalSchemes}`);
  console.log(`✅ Fully fetched schemes: ${fullyFetched}`);
  console.log(`⏳ Remaining to fetch: ${totalSchemes - fullyFetched}`);
  console.log(`🔄 Updated this run: ${updatedCount}`);

  return new Response(
    JSON.stringify({
      message: "Schemes updated selectively",
      updatedThisRun: updatedCount,
      total: totalSchemes,
      fullyFetched,
      remaining: totalSchemes - fullyFetched,
    }),
    { status: 200 }
  );
}
