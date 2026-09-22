import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Membership from "@/models/Membership";
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
    // ORGANIZATION YANG DIPIMPIN
    // =======================
    const adminMemberships = await Membership.find(
      {
        userId: payload.id,
        role: "Admin",
      },
      "organizationId"
    ).lean();

    const organizationIds = adminMemberships.map(
      (m: any) => m.organizationId
    );

    if (organizationIds.length === 0) {
      return NextResponse.json([]);
    }

    // =======================
    // AGGREGATION (1 QUERY)
    // =======================
    const requests = await GroupJoinRequest.aggregate([
      {
        $match: {
          status: "Pending",
        },
      },
      {
        $lookup: {
          from: "groups",
          localField: "groupId",
          foreignField: "_id",
          as: "group",
        },
      },
      {
        $unwind: "$group",
      },
      {
        $match: {
          "group.organizationId": {
            $in: organizationIds,
          },
        },
      },
      {
        $lookup: {
          from: "memberships",
          localField: "membershipId",
          foreignField: "_id",
          as: "member",
        },
      },
      {
        $unwind: "$member",
      },
      {
        $project: {
          _id: 1,
          membershipId: "$member._id",
          memberName: "$member.name",
          walletAddress: "$member.walletAddress",
          groupId: "$group._id",
          groupName: "$group.name",
          createdAt: 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return NextResponse.json(requests);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}