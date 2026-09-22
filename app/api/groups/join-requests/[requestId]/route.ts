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

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );

    const { id } = verifyToken(token) as { id: string };
    const { requestId } = await params;
    const { action } = await req.json();

    const request = await GroupJoinRequest.findById(requestId);
    if (!request)
      return NextResponse.json(
        { message: "Request not found" },
        { status: 404 }
      );

    const group = await Group.findById(request.groupId);
    if (!group)
      return NextResponse.json(
        { message: "Group not found" },
        { status: 404 }
      );

    if (String(group.leaderId) !== id)
      return NextResponse.json(
        { message: "Only leader can approve requests" },
        { status: 403 }
      );

    // =======================
    // REJECT
    // =======================
    if (action === "Rejected") {
      await GroupJoinRequest.findByIdAndUpdate(requestId, {
        status: "Rejected",
      });

      return NextResponse.json({
        message: "Request rejected",
      });
    }

    // =======================
    // APPROVE
    // =======================
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

    await GroupJoinRequest.findByIdAndUpdate(requestId, {
      status: "Approved",
    });

    const total = await GroupMember.countDocuments({
      groupId: group._id,
    });

    await Group.updateOne(
      { _id: group._id },
      { members: total }
    );

    return NextResponse.json({
      message: "Member approved successfully",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}