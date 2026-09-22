import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Organization from "@/models/Organization";
import Membership from "@/models/Membership";
import History from "@/models/History";
import Group from "@/models/Group";

// ================= GET =================
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    await connectDB();

    const { orgId } = await params;

    const org = await Organization.findOne({ slug: orgId }).lean();

    if (!org) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      _id: org._id,
      name: org.name,
      slug: org.slug,
      description: org.description,
      treasury: org.treasury,
      members: org.members.length,
      owner: org.owner,
      code: org.code,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ================= DELETE =================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
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
    const { orgId } = await params;

    const org = await Organization.findById(orgId, "_id").lean();
    if (!org)
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );

    const leader = await Membership.exists({
      organizationId: orgId,
      userId,
      role: "Admin",
    });

    if (!leader)
      return NextResponse.json(
        {
          message: "Only the leader can delete this organization",
        },
        { status: 403 }
      );

    await Promise.all([
      Group.deleteMany({ organizationId: orgId }),
      Membership.deleteMany({ organizationId: orgId }),
      History.deleteMany({ organizationId: orgId }),
      Organization.findByIdAndDelete(orgId),
    ]);

    return NextResponse.json({
      message: "Organization deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}