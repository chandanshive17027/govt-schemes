import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { toast } from "sonner";
const prisma = new PrismaClient();

export async function GET(_req: NextRequest) {
  try {
    const schemes = await prisma.scheme.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(schemes);
  } catch (err: unknown) {
      // Safely check if `err` is an instance of `Error`
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("❌ An unexpected error occurred.");
      }
    }
}
