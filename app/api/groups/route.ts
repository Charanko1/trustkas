import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Group from "@/models/Group";
import Organization from "@/models/Organization";
import Membership from "@/models/Membership";

// =======================
// GET GROUPS
// =======================
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const organization = searchParams.get("organization");

    const groups = await Group.find({
      organizationSlug: organization,
    });

    return NextResponse.json(groups);
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

    // Cari organisasi
    const organization = await Organization.findOne({
      slug: body.organizationSlug,
    });

    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    // =======================
    // CEK LEADER (FIX)
    // =======================
    if (organization.owner.toString() !== payload.id) {
      return NextResponse.json(
        { message: "Only leader can create groups" },
        { status: 403 }
      );
    }

    // Ambil nama leader
    const leader = await Membership.findOne({
      organizationId: organization._id,
      userId: payload.id,
      role: "Admin",
    });

    const group = await Group.create({
      name: body.name,
      description: body.description,
      organizationSlug: body.organizationSlug,
      leader: leader?.name || "Leader",
      members: 1,
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