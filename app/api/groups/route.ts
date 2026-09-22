import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Group from "@/models/Group";
import Organization from "@/models/Organization";
import Membership from "@/models/Membership";
import GroupMember from "@/models/GroupMember";
import GroupJoinRequest from "@/models/GroupJoinRequest";

// =======================
// GET GROUPS
// =======================
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const slug = req.nextUrl.searchParams.get("organization");
    if (!slug) return NextResponse.json([]);

    const orgId = (await Organization.findOne({ slug }, "_id").lean())?._id;
    if (!orgId) return NextResponse.json([]);

    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    let membershipId = null;

    if (token) {
      const { id } = verifyToken(token) as { id: string };

      membershipId = (
        await Membership.findOne(
          { organizationId: orgId, userId: id },
          "_id"
        ).lean()
      )?._id;
    }

    const groups = await Group.find({ organizationSlug: slug })
      .sort({ createdAt: -1 })
      .lean();

    const groupIds = groups.map((g: any) => g._id);

    const [counts, joined, pending] = await Promise.all([
      GroupMember.aggregate([
        { $match: { groupId: { $in: groupIds } } },
        {
          $group: {
            _id: "$groupId",
            total: { $sum: 1 },
          },
        },
      ]),

      membershipId
        ? GroupMember.find(
            { membershipId, groupId: { $in: groupIds } },
            "groupId"
          ).lean()
        : Promise.resolve([]),

      membershipId
        ? GroupJoinRequest.find(
            {
              membershipId,
              status: "Pending",
              groupId: { $in: groupIds },
            },
            "groupId"
          ).lean()
        : Promise.resolve([]),
    ]);

    const countMap = new Map(counts.map((c: any) => [String(c._id), c.total]));
    const joinedSet = new Set(joined.map((j: any) => String(j.groupId)));
    const pendingSet = new Set(pending.map((p: any) => String(p.groupId)));

    return NextResponse.json(
      groups.map((g: any) => ({
        ...g,
        members: countMap.get(String(g._id)) ?? 0,
        joined: joinedSet.has(String(g._id)),
        pending: pendingSet.has(String(g._id)),
      }))
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// =======================
// CREATE GROUP
// =======================
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );

    const { id } = verifyToken(token) as { id: string };
    const body = await req.json();

    const org = await Organization.findOne({ slug: body.organizationSlug });
    if (!org)
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );

    if (String(org.owner) !== id)
      return NextResponse.json(
        { message: "Only leader can create groups" },
        { status: 403 }
      );

    const leader = await Membership.findOne({
      organizationId: org._id,
      userId: id,
      role: "Admin",
    });

    if (!leader)
      return NextResponse.json(
        { message: "Leader not found" },
        { status: 404 }
      );

    const group = await Group.create({
      name: body.name,
      description: body.description,
      organizationId: org._id,
      organizationSlug: org.slug,
      organizationName: org.name,
      leader: leader.name,
      leaderId: id,
      members: 1,
    });

    await GroupMember.create({
      groupId: group._id,
      membershipId: leader._id,
      role: "Admin", // FIX
    });

    return NextResponse.json(group, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}