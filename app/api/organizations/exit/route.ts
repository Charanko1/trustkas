import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Organization from "@/models/Organization";
import Membership from "@/models/Membership";
import History from "@/models/History";

export async function DELETE(req: NextRequest) {
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
    const { organizationId } = await req.json();

    const membership = await Membership.findOne({
      organizationId,
      userId: payload.id,
    });

    if (!membership) {
      return NextResponse.json(
        { message: "Membership not found" },
        { status: 404 }
      );
    }

    if (membership.role === "Admin") {
      return NextResponse.json(
        {
          message:
            "Leader cannot exit. Delete the organization instead.",
        },
        { status: 403 }
      );
    }

    await Membership.deleteOne({ _id: membership._id });

    await Organization.findByIdAndUpdate(organizationId, {
      $pull: { members: payload.id },
    });

    await History.create({
      organizationId,
      userId: payload.id,
      type: "APPROVAL",
      title: "Member Left",
      description: `${membership.name} left the organization`,
    });

    return NextResponse.json({
      message: "Exited successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}