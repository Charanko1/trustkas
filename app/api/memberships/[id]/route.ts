import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Membership from "@/models/Membership";
import History from "@/models/History";
import Organization from "@/models/Organization";
import Group from "@/models/Group";
import GroupMember from "@/models/GroupMember";

// =======================
// SET VALIDATOR
// =======================
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id } = await params;
    const body = await req.json();

    const target = await Membership.findById(id);

    if (!target) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 }
      );
    }

    const admin = await Membership.findOne({
      organizationId: target.organizationId,
      userId: payload.id,
      role: "Admin",
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Only leader can appoint validator" },
        { status: 403 }
      );
    }

    target.role = body.role;
    await target.save();

    await History.create({
      organizationId: target.organizationId,
      userId: payload.id,
      type: "VALIDATOR",
      title: "Validator Appointed",
      description: `${admin.name} appointed ${target.name} as Validator`,
    });

    return NextResponse.json({
      message: "Validator updated successfully",
      member: target,
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
// REMOVE MEMBER
// =======================
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id } = await params;

    const target = await Membership.findById(id);

    if (!target) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 }
      );
    }

    const admin = await Membership.findOne({
      organizationId: target.organizationId,
      userId: payload.id,
      role: "Admin",
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Only leader can remove members" },
        { status: 403 }
      );
    }

    if (target.role === "Admin") {
      return NextResponse.json(
        { message: "Leader cannot be removed" },
        { status: 400 }
      );
    }

    // =======================
    // HAPUS DARI SEMUA GROUP
    // =======================
    const affectedGroups = await GroupMember.find({
      membershipId: target._id,
    }).select("groupId");

    await GroupMember.deleteMany({
      membershipId: target._id,
    });

    // Sinkron jumlah member tiap group
    for (const item of affectedGroups) {
      const totalMember = await GroupMember.countDocuments({
        groupId: item.groupId,
      });

      await Group.findByIdAndUpdate(item.groupId, {
        members: totalMember,
      });
    }

    // =======================
    // HAPUS MEMBERSHIP
    // =======================
    await Membership.findByIdAndDelete(id);

    // Hapus relasi di Organization
    await Organization.findByIdAndUpdate(
      target.organizationId,
      {
        $pull: {
          members: target.userId,
        },
      }
    );

    // =======================
    // HISTORY
    // =======================
    await History.create({
      organizationId: target.organizationId,
      userId: payload.id,
      type: "APPROVAL",
      title: "Member Removed",
      description: `${admin.name} removed ${target.name} from the organization`,
    });

    return NextResponse.json({
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}