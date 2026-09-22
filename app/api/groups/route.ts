import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Group from "@/models/Group";
import Organization from "@/models/Organization";
import Membership from "@/models/Membership";
import GroupMember from "@/models/GroupMember";
import GroupJoinRequest from "@/models/GroupJoinRequest";

// =======================
// GET GROUPS BY ORGANIZATION
// =======================
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const organizationSlug = searchParams.get("organization");

    if (!organizationSlug) {
      return NextResponse.json([]);
    }

    const organization = await Organization.findOne(
      { slug: organizationSlug },
      "_id"
    ).lean();

    if (!organization) {
      return NextResponse.json([]);
    }

    const token = req.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    let membership: any = null;

    if (token) {
      const payload = verifyToken(token) as { id: string };

      membership = await Membership.findOne(
        {
          organizationId: organization._id,
          userId: payload.id,
        },
        "_id role"
      ).lean();
    }

    const groups = await Group.find(
      { organizationSlug },
      "name description leader organizationId organizationSlug organizationName createdAt"
    )
      .sort({ createdAt: -1 })
      .lean();

    const groupIds = groups.map((g: any) => g._id);

    const memberCounts = await GroupMember.aggregate([
      {
        $match: {
          groupId: { $in: groupIds },
        },
      },
      {
        $group: {
          _id: "$groupId",
          total: { $sum: 1 },
        },
      },
    ]);

    const countMap = new Map(
      memberCounts.map((m: any) => [String(m._id), m.total])
    );

    let joinedSet = new Set<string>();
    let pendingSet = new Set<string>();

    if (membership) {
      const joined = await GroupMember.find(
        {
          membershipId: membership._id,
          groupId: { $in: groupIds },
        },
        "groupId"
      ).lean();

      joinedSet = new Set(
        joined.map((j: any) => String(j.groupId))
      );

      const pending = await GroupJoinRequest.find(
        {
          membershipId: membership._id,
          status: "Pending",
          groupId: { $in: groupIds },
        },
        "groupId"
      ).lean();

      pendingSet = new Set(
        pending.map((p: any) => String(p.groupId))
      );
    }

    const result = groups.map((group: any) => ({
      _id: group._id,
      name: group.name,
      description: group.description,
      leader: group.leader,
      members: countMap.get(String(group._id)) ?? 0,

      organizationId: group.organizationId,
      organizationSlug: group.organizationSlug,
      organizationName: group.organizationName,

      joined: joinedSet.has(String(group._id)),
      pending: pendingSet.has(String(group._id)),
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

// =======================
// CREATE GROUP (Leader Only)
// =======================
export async function POST(req: NextRequest) {
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
    const body = await req.json();

    const organization = await Organization.findOne({
      slug: body.organizationSlug,
    });

    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    if (organization.owner.toString() !== payload.id) {
      return NextResponse.json(
        { message: "Only leader can create groups" },
        { status: 403 }
      );
    }

    const leader = await Membership.findOne({
      organizationId: organization._id,
      userId: payload.id,
      role: "Admin",
    });

    if (!leader) {
      return NextResponse.json(
        { message: "Leader not found" },
        { status: 404 }
      );
    }

    const group = await Group.create({
      name: body.name,
      description: body.description,
      organizationId: organization._id,
      organizationSlug: organization.slug,
      organizationName: organization.name,
      leader: leader.name,
      leaderId: payload.id,
    });

    await GroupMember.create({
      groupId: group._id,
      membershipId: leader._id,
      role: "Admin",
    });

    return NextResponse.json(group, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}