import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import Election from "@/models/Election";
import Organization from "@/models/Organization";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const organizationSlug = searchParams.get("organization");

    if (!organizationSlug) {
      return NextResponse.json([]);
    }

    // Cari organization berdasarkan slug
    const organization = await Organization.findOne({
      slug: organizationSlug,
    });

    if (!organization) {
      return NextResponse.json([]);
    }

    // Baru cari election memakai ObjectId
    const elections = await Election.find({
      organizationId: organization._id,
    }).sort({ createdAt: -1 });

    return NextResponse.json(elections);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch elections" },
      { status: 500 }
    );
  }
}