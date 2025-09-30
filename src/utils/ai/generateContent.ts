// // src/utils/hooks/gemini/GeneratewithAi.ts
// import { GoogleGenAI } from "@google/genai";

// const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// export async function generateSummary(
//   prompt: string,
//   maxTokens = 500
// ): Promise<string> {
//   let attempt = 0;
//   const maxAttempts = 3;

//   while (attempt < maxAttempts) {
//     try {
//       const model = await genAI.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: [{ parts: [{ text: prompt }] }],
//       });

//       const text = model.text?.trim() || "";
//       return text;
//     } catch (err: any) {
//       if (err?.status === 503 && attempt < maxAttempts - 1) {
//         console.warn(`⚠️ Gemini overloaded, retrying in ${1000 * (attempt + 1)}ms...`);
//         await new Promise((res) => setTimeout(res, 1000 * (attempt + 1)));
//         attempt++;
//       } else {
//         console.error("❌ Gemini API Error:", err);
//         throw new Error("Gemini API failed to generate summary.");
//       }
//     }
//   }

//   throw new Error("Gemini API is overloaded. Please try again later.");
// }
