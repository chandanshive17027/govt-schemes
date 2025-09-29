// src/app/api/mark-all-fetched/route.ts

import { prisma } from "@/utils/actions/database/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const updated = await prisma.scheme.updateMany({
      data: { detailsFetched: false }, // set all to true
      where: { details: null }, // only update those that are currently false
    });

    return NextResponse.json({
      message: `✅ Updated ${updated.count} schemes with detailsFetched = true`,
    });
  } catch (error) {
    console.error("Error updating schemes:", error);
    return NextResponse.json(
      { error: "Error updating schemes" },
      { status: 500 }
    );
  }
}
