import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Membership from "@/models/Membership";
import Group from "@/models/Group";
import GroupJoinRequest from "@/models/GroupJoinRequest";

export async function GET(req: NextRequest) {
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

    // =======================
    // LEADER ORGANIZATIONS
    // =======================
    const adminMemberships = await Membership.find({
      userId: payload.id,
      role: "Admin",
    });

    const organizationIds = adminMemberships.map(
      (m) => m.organizationId
    );

    // =======================
    // GROUPS
    // =======================
    const groups = await Group.find({
      organizationId: { $in: organizationIds },
    });

    const groupIds = groups.map((g) => g._id);

    // =======================
    // PENDING REQUESTS
    // =======================
    const requests = await GroupJoinRequest.find({
      groupId: { $in: groupIds },
      status: "Pending",
    })
      .populate("membershipId", "name walletAddress")
      .populate("groupId", "name");

    const result = requests.map((req: any) => ({
      _id: req._id,

      membershipId: req.membershipId._id,
      memberName: req.membershipId.name,
      walletAddress: req.membershipId.walletAddress,

      groupId: req.groupId._id,
      groupName: req.groupId.name,

      createdAt: req.createdAt,
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