import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Organization from "@/models/Organization";
import Membership from "@/models/Membership";
import History from "@/models/History";
import Group from "@/models/Group";

// =======================
// GET ORGANIZATION
// =======================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    await connectDB();

    const { orgId } = await params;

    const organization = await Organization.findOne({
      slug: orgId,
    });

    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      _id: organization._id,
      name: organization.name,
      slug: organization.slug,
      description: organization.description,
      treasury: organization.treasury,
      members: organization.members.length,
      owner: organization.owner,
      code: organization.code,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// =======================
// DELETE ORGANIZATION
// =======================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
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
    const { orgId } = await params;

    // orgId di DELETE = Mongo ObjectId
    const organization = await Organization.findById(orgId);

    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    // Hanya Leader
    const leader = await Membership.findOne({
      organizationId: orgId,
      userId: payload.id,
      role: "Admin",
    });

    if (!leader) {
      return NextResponse.json(
        {
          message:
            "Only the leader can delete this organization",
        },
        { status: 403 }
      );
    }

    // Cascade delete
    await Group.deleteMany({ organizationId: orgId });
    await Membership.deleteMany({
      organizationId: orgId,
    });
    await History.deleteMany({ organizationId: orgId });

    await Organization.findByIdAndDelete(orgId);

    return NextResponse.json({
      message: "Organization deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}