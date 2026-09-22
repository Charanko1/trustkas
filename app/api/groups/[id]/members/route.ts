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

    const token = req.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string };
    const { id } = await params;

    const group = await Group.findById(id);

    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    const membership = await Membership.findOne({
      organizationId: group.organizationId,
      userId: payload.id,
    });

    if (!membership) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const members = await GroupMember.find({
      groupId: group._id,
    }).populate({
      path: "membershipId",
      model: "Membership",
      select: "name walletAddress",
    });

    const result = members
      .filter((m: any) => m.membershipId)
      .map((m: any) => ({
        _id: m.membershipId._id,
        name: m.membershipId.name,
        walletAddress: m.membershipId.walletAddress || "",
        role: m.role,
      }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}