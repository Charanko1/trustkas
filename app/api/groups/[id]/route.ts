import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Group from "@/models/Group";
import Membership from "@/models/Membership";
import GroupMember from "@/models/GroupMember";
import Proposal from "@/models/Proposal";

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

    const group = await Group.findById(id).lean();
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
      "role"
    ).lean();

    if (!membership)
      return NextResponse.json(
        { message: "You are not an organization member" },
        { status: 403 }
      );

    const isLeader = membership.role === "Admin";

    if (!isLeader) {
      const joined = await GroupMember.exists({
        groupId: group._id,
        membershipId: membership._id,
      });

      if (!joined)
        return NextResponse.json(
          { message: "You haven't joined this group" },
          { status: 403 }
        );
    }

    const [memberCount, proposalCount] = await Promise.all([
      GroupMember.countDocuments({ groupId: group._id }),
      Proposal.countDocuments({ groupId: group._id }),
    ]);

    return NextResponse.json({
      _id: group._id,
      name: group.name,
      description: group.description,
      leader: group.leader,
      leaderId: group.leaderId,
      organizationId: group.organizationId,
      organizationName: group.organizationName,
      organizationSlug: group.organizationSlug,
      members: memberCount,
      totalProposal: proposalCount,
      isLeader,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}