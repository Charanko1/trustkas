import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Group from "@/models/Group";
import Membership from "@/models/Membership";
import GroupMember from "@/models/GroupMember";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );

    const { id: userId } = verifyToken(token) as { id: string };
    const { id } = await params;

    const group = await Group.findById(id, "organizationId").lean();
    if (!group)
      return NextResponse.json(
        { message: "Group not found" },
        { status: 404 }
      );

    const membership = await Membership.findOne(
      {
        organizationId: group.organizationId,
        userId,
      },
      "_id"
    ).lean();

    if (!membership)
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );

    const members = await GroupMember.find({ groupId: id })
      .populate({
        path: "membershipId",
        select: "name walletAddress",
      })
      .lean();

    return NextResponse.json(
      members
        .filter((m: any) => m.membershipId)
        .map((m: any) => ({
          _id: m.membershipId._id,
          name: m.membershipId.name,
          walletAddress: m.membershipId.walletAddress || "",
          role: m.role,
        }))
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}