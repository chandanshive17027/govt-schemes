import { prisma } from "@/utils/actions/database/prisma";
import { NextResponse } from "next/server";
import { toast } from "sonner";

export async function GET(req: Request) {
  try {
    const { search, page, limit, state, ministry, gender, occupation, caste } = Object.fromEntries(
      new URL(req.url).searchParams
    );

    const take = limit ? parseInt(limit as string, 10) : 10;
    const skip = page ? (parseInt(page as string, 10) - 1) * take : 0;

    // Build filter object dynamically
    const filters: any = {};

    if (search) {
      filters.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { ministry: { contains: search as string, mode: "insensitive" } },
        { state: { contains: search as string, mode: "insensitive" } },
        { tags: { has: search as string } },
      ];
    }

    if (state) {
      filters.state = { equals: state as string, mode: "insensitive" };
    }

    if (ministry) {
      filters.ministry = { equals: ministry as string, mode: "insensitive" };
    }

    // Eligibility filters
    if (gender || occupation || caste) {
      filters.eligible = {
        some: {
          ...(gender && { gender: gender as string }),
          ...(occupation && { occupation: occupation as string }),
          ...(caste && { castecategory: caste as string }),
        },
      };
    }

    const total = await prisma.scheme.count({ where: filters });

    const schemes = await prisma.scheme.findMany({
      where: filters,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, ministry: true, state: true, tags: true },
    });

    return NextResponse.json({ schemes, total });
  } catch (err: unknown) {
      // Safely check if `err` is an instance of `Error`
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("❌ An unexpected error occurred.");
      }
    }
}
