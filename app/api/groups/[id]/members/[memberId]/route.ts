import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Group from "@/models/Group";
import Membership from "@/models/Membership";
import GroupMember from "@/models/GroupMember";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
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
    const { id, memberId } = await params;

    const group = await Group.findById(id, "organizationId").lean();
    if (!group)
      return NextResponse.json(
        { message: "Group not found" },
        { status: 404 }
      );

    const leader = await Membership.findOne(
      {
        organizationId: group.organizationId,
        userId,
        role: "Admin",
      },
      "_id"
    ).lean();

    if (!leader)
      return NextResponse.json(
        { message: "Only leader can remove members" },
        { status: 403 }
      );

    if (String(leader._id) === memberId)
      return NextResponse.json(
        { message: "Leader cannot remove themselves" },
        { status: 400 }
      );

    const deleted = await GroupMember.findOneAndDelete({
      groupId: id,
      membershipId: memberId,
    });

    if (!deleted)
      return NextResponse.json(
        { message: "Member not found in this group" },
        { status: 404 }
      );

    const totalMember = await GroupMember.countDocuments({ groupId: id });

    await Group.findByIdAndUpdate(id, {
      members: totalMember,
    });

    return NextResponse.json({
      message: "Member removed successfully",
      members: totalMember,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}