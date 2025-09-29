//src/app/api/scheme-details/parse-eligibility/route.ts
import { PrismaClient } from "@prisma/client";
import { exec } from "child_process";

const prisma = new PrismaClient();

export async function GET() {
  // Fetch schemes with eligibility text
  const schemes = await prisma.scheme.findMany({
    where: { eligibility: { not: null } },
    select: { id: true, eligibility: true, eligible: true, state: true, ministry: true },
  });

  // Filter in JS: only process schemes that don't yet have parsed eligibility
  const pending = schemes.filter(
    (s) =>
      !s.eligible ||
      (Array.isArray(s.eligible) && s.eligible.length === 0)
  );

  if (!pending.length) {
    return new Response(
      JSON.stringify({ message: "No schemes left to process" }),
      { status: 200 }
    );
  }

  let updatedCount = 0;

  for (const scheme of pending) {
    await new Promise((resolve) => {
      const eligibilityText = scheme.eligibility?.replace(/"/g, '\\"') || "";
      const defaultState = scheme.state ? scheme.state.replace(/"/g, '\\"') : "";
      const defaultMinistry = scheme.ministry ? scheme.ministry.replace(/"/g, '\\"') : "";

      // Call Python script with eligibility text, state, and ministry
      exec(
        `python3 src/scripts/eligibility.py "${eligibilityText}" "${defaultState}" "${defaultMinistry}"`,
        { maxBuffer: 1024 * 1024 * 5 },
        async (error, stdout) => {
          if (error) {
            console.error("❌ Error parsing eligibility:", error.message);
            return resolve(null);
          }

          try {
            const parsed = JSON.parse(stdout);

            await prisma.scheme.update({
              where: { id: scheme.id },
              data: {
                eligible: [parsed], // Save structured JSON
              },
            });

            updatedCount++;
            resolve(true);
          } catch (err) {
            console.error("⚠️ Failed to parse JSON for scheme:", scheme.id, err);
            resolve(null);
          }
        }
      );
    });
  }

  return new Response(
    JSON.stringify({
      message: "Eligibility processed",
      updatedThisRun: updatedCount,
      totalPending: pending.length,
    }),
    { status: 200 }
  );
}


// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET() {
//   try {
//     // Fetch all scheme IDs
//     const schemes = await prisma.scheme.findMany({
//       select: { id: true }
//     });

//     let updatedCount = 0;

//     for (const scheme of schemes) {
//       await prisma.scheme.update({
//         where: { id: scheme.id },
//         data: { eligible: [] },
//       });
//       updatedCount++;
//     }

//     return new Response(
//       JSON.stringify({
//         message: "✅ All scheme eligible fields reset",
//         updatedCount,
//       }),
//       { status: 200 }
//     );
//   } catch (err: any) {
//     console.error("❌ Error resetting eligible field:", err);
//     return new Response(JSON.stringify({ error: err.message }), { status: 500 });
//   }
// }

