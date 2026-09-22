import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Group from "@/models/Group";
import Membership from "@/models/Membership";
import GroupMember from "@/models/GroupMember";
import GroupJoinRequest from "@/models/GroupJoinRequest";

export async function POST(
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
      "_id role"
    ).lean();

    if (!membership)
      return NextResponse.json(
        { message: "You are not a member of this organization" },
        { status: 403 }
      );

    if (membership.role === "Admin")
      return NextResponse.json(
        { message: "Leader is already part of this group" },
        { status: 400 }
      );

    const joined = await GroupMember.exists({
      groupId: id,
      membershipId: membership._id,
    });

    if (joined)
      return NextResponse.json(
        { message: "You already joined this group" },
        { status: 400 }
      );

    const request = await GroupJoinRequest.findOne({
      groupId: id,
      membershipId: membership._id,
    }).lean();

    if (request?.status === "Pending")
      return NextResponse.json(
        { message: "Join request already pending" },
        { status: 400 }
      );

    if (request?.status === "Approved")
      return NextResponse.json(
        { message: "You already joined this group" },
        { status: 400 }
      );

    if (request?.status === "Rejected") {
      const updated = await GroupJoinRequest.findByIdAndUpdate(
        request._id,
        { status: "Pending" },
        { new: true }
      );

      return NextResponse.json(
        {
          message: "Join request sent successfully",
          request: updated,
        },
        { status: 200 }
      );
    }

    const newRequest = await GroupJoinRequest.create({
      groupId: id,
      membershipId: membership._id,
      status: "Pending",
    });

    return NextResponse.json(
      {
        message: "Join request sent successfully",
        request: newRequest,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}