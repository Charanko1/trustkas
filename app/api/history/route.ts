import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import History from "@/models/History";
import Membership from "@/models/Membership";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token) as { id: string };

    // Cari semua organisasi yang diikuti user
    const memberships = await Membership.find({
      userId: payload.id,
    });

    const organizationIds = memberships.map(
      (m) => m.organizationId
    );

    // Ambil seluruh history organisasi tersebut
    const histories = await History.find({
      organizationId: { $in: organizationIds },
    }).sort({ createdAt: -1 });

    return NextResponse.json(histories);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}