import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Membership from "@/models/Membership";
import Organization from "@/models/Organization";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );

    verifyToken(token);

    const slug = req.nextUrl.searchParams.get("organization");
    if (!slug) return NextResponse.json([]);

    const organizationId = (
      await Organization.findOne({ slug }, "_id").lean()
    )?._id;

    if (!organizationId) return NextResponse.json([]);

    const members = await Membership.find(
      { organizationId },
      "name role walletAddress userId createdAt"
    )
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json(members);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}