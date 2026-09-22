import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Organization from "@/models/Organization";
import Membership from "@/models/Membership";
import History from "@/models/History";

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );

    const { id: userId } = verifyToken(token) as { id: string };
    const { organizationId } = await req.json();

    const membership = await Membership.findOne({
      organizationId,
      userId,
    }).lean();

    if (!membership)
      return NextResponse.json(
        { message: "Membership not found" },
        { status: 404 }
      );

    if (membership.role === "Admin")
      return NextResponse.json(
        {
          message: "Leader cannot exit. Delete the organization instead.",
        },
        { status: 403 }
      );

    await Promise.all([
      Membership.deleteOne({ _id: membership._id }),
      Organization.findByIdAndUpdate(organizationId, {
        $pull: { members: userId },
      }),
      History.create({
        organizationId,
        userId,
        type: "APPROVAL",
        title: "Member Left",
        description: `${membership.name} left the organization`,
      }),
    ]);

    return NextResponse.json({
      message: "Exited successfully",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}