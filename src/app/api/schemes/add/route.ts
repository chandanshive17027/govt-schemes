// src/app/api/schemes/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { notifyUsersForNewScheme } from "@/utils/actions/notifications/sendSchemeEmail";


const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (!data.name || !data.link) {
      return NextResponse.json({ message: "Name and Link are required" }, { status: 400 });
    }

    const newScheme = await prisma.scheme.create({
      data: {
        name: data.name,
        state: data.state || null,
        ministry: data.ministry || null,
        tags: data.tags || [],
        details: data.details || null,
        eligibility: data.eligibility || null,
        benefits: data.benefits || null,
        application_process: data.application_process || null,
        documents_required: data.documents_required || null,
        faqs: data.faqs || [],
        sources_and_resources: data.sources_and_resources || [],
        link: data.link,
        detailsFetched: data.detailsFetched || false,
        eligible: data.eligible || [],
      },
    });

    // ✅ Notify users
    await notifyUsersForNewScheme(newScheme.id);

    return NextResponse.json({ message: "Scheme added successfully", scheme: newScheme });
  } catch (err: any) {
    console.error("Error adding scheme:", err);
    if (err.code === "P2002" && err.meta?.target?.includes("link")) {
      return NextResponse.json({ message: "Scheme with this link already exists" }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
