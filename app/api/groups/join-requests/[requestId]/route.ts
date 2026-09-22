import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Group from "@/models/Group";
import GroupMember from "@/models/GroupMember";
import GroupJoinRequest from "@/models/GroupJoinRequest";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
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
    const { requestId } = await params;
    const { action } = await req.json();

    const request = await GroupJoinRequest.findById(requestId);

    if (!request) {
      return NextResponse.json(
        { message: "Request not found" },
        { status: 404 }
      );
    }

    const group = await Group.findById(request.groupId);

    if (!group) {
      return NextResponse.json(
        { message: "Group not found" },
        { status: 404 }
      );
    }

    // Hanya leader group
    if (group.leaderId.toString() !== payload.id) {
      return NextResponse.json(
        { message: "Only leader can approve requests" },
        { status: 403 }
      );
    }

    // Reject
    if (action === "Rejected") {
      request.status = "Rejected";
      await request.save();

      return NextResponse.json({
        message: "Request rejected",
      });
    }

    // Approve
    const exist = await GroupMember.findOne({
      groupId: group._id,
      membershipId: request.membershipId,
    });

    if (!exist) {
      await GroupMember.create({
        groupId: group._id,
        membershipId: request.membershipId,
        role: "Member",
      });
    }

    request.status = "Approved";
    await request.save();

    // Sinkron jumlah member
    const total = await GroupMember.countDocuments({
      groupId: group._id,
    });

    group.members = total;
    await group.save();

    return NextResponse.json({
      message: "Member approved successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}