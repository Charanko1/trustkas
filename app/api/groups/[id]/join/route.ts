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
    const { id } = await params;

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
    // MEMBERSHIP
    // =======================
    const membership = await Membership.findOne({
      organizationId: group.organizationId,
      userId: payload.id,
    });

    if (!membership) {
      return NextResponse.json(
        {
          message: "You are not a member of this organization",
        },
        { status: 403 }
      );
    }

    // Leader tidak boleh request
    if (membership.role === "Admin") {
      return NextResponse.json(
        { message: "Leader is already part of this group" },
        { status: 400 }
      );
    }

    // =======================
    // ALREADY MEMBER
    // =======================
    const alreadyMember = await GroupMember.findOne({
      groupId: group._id,
      membershipId: membership._id,
    });

    if (alreadyMember) {
      return NextResponse.json(
        { message: "You already joined this group" },
        { status: 400 }
      );
    }

    // =======================
    // CHECK REQUEST
    // =======================
    const existingRequest = await GroupJoinRequest.findOne({
      groupId: group._id,
      membershipId: membership._id,
    });

    if (existingRequest) {
      // Masih pending
      if (existingRequest.status === "Pending") {
        return NextResponse.json(
          { message: "Join request already pending" },
          { status: 400 }
        );
      }

      // Sudah di-approve (jaga-jaga)
      if (existingRequest.status === "Approved") {
        return NextResponse.json(
          { message: "You already joined this group" },
          { status: 400 }
        );
      }

      // Rejected → boleh request lagi
      if (existingRequest.status === "Rejected") {
        existingRequest.status = "Pending";
        await existingRequest.save();

        return NextResponse.json(
          {
            message: "Join request sent successfully",
            request: existingRequest,
          },
          { status: 200 }
        );
      }
    }

    // =======================
    // CREATE REQUEST
    // =======================
    const requestJoin = await GroupJoinRequest.create({
      groupId: group._id,
      membershipId: membership._id,
      status: "Pending",
    });

    return NextResponse.json(
      {
        message: "Join request sent successfully",
        request: requestJoin,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}