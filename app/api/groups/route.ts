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

    // ambil user dari token (optional)
    const token = req.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    let membership: any = null;

    if (token) {
      const payload = verifyToken(token) as { id: string };

      const organization = await Organization.findOne({
        slug: organizationSlug,
      });

      if (organization) {
        membership = await Membership.findOne({
          organizationId: organization._id,
          userId: payload.id,
        });
      }
    }

    const groups = await Group.find({
      organizationSlug,
    }).sort({ createdAt: -1 });

    const result = await Promise.all(
      groups.map(async (group) => {
        const memberCount = await GroupMember.countDocuments({
          groupId: group._id,
        });

        let joined = false;
        let pending = false;

        if (membership) {
          const member = await GroupMember.findOne({
            groupId: group._id,
            membershipId: membership._id,
          });

          joined = !!member;

          if (!joined) {
            const request = await GroupJoinRequest.findOne({
              groupId: group._id,
              membershipId: membership._id,
              status: "Pending",
            });

            pending = !!request;
          }
        }

        return {
          _id: group._id,
          name: group.name,
          description: group.description,
          leader: group.leader,
          members: memberCount,

          organizationId: group.organizationId,
          organizationSlug: group.organizationSlug,
          organizationName: group.organizationName,

          joined,
          pending,
        };
      })
    );

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

    // hanya leader
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

    // leader otomatis jadi anggota group
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