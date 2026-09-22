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

    // =======================
    // AUTH
    // =======================
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
    const { id, memberId } = await params;

    // =======================
    // GROUP
    // =======================
    const group = await Group.findById(id);

    if (!group) {
      return NextResponse.json(
        { message: "Group not found" },
        { status: 404 }
      );
    }

    // =======================
    // ONLY LEADER
    // =======================
    const leader = await Membership.findOne({
      organizationId: group.organizationId,
      userId: payload.id,
      role: "Admin",
    });

    if (!leader) {
      return NextResponse.json(
        { message: "Only leader can remove members" },
        { status: 403 }
      );
    }

    // Tidak boleh menghapus diri sendiri
    if (leader._id.toString() === memberId) {
      return NextResponse.json(
        { message: "Leader cannot remove themselves" },
        { status: 400 }
      );
    }

    // =======================
    // REMOVE MEMBER
    // =======================
    const deleted = await GroupMember.findOneAndDelete({
      groupId: id,
      membershipId: memberId,
    });

    if (!deleted) {
      return NextResponse.json(
        { message: "Member not found in this group" },
        { status: 404 }
      );
    }

    // =======================
    // SYNC MEMBER COUNT
    // =======================
    const totalMember = await GroupMember.countDocuments({
      groupId: id,
    });

    group.members = totalMember;
    await group.save();

    return NextResponse.json({
      message: "Member removed successfully",
      members: totalMember,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}