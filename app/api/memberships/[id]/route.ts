import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Membership from "@/models/Membership";
import History from "@/models/History";
import Organization from "@/models/Organization";
import Group from "@/models/Group";
import GroupMember from "@/models/GroupMember";

async function getAdmin(req: NextRequest, membershipId: string) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;

  const { id } = verifyToken(token) as { id: string };

  const target = await Membership.findById(membershipId);
  if (!target) return null;

  const admin = await Membership.findOne({
    organizationId: target.organizationId,
    userId: id,
    role: "Admin",
  });

  if (!admin) return null;

  return { admin, target, userId: id };
}

// =======================
// SET VALIDATOR
// =======================
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    const data = await getAdmin(req, id);

    if (!data)
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );

    const { admin, target, userId } = data;

    target.role = body.role;
    await target.save();

    await History.create({
      organizationId: target.organizationId,
      userId,
      type: "VALIDATOR",
      title: "Validator Appointed",
      description: `${admin.name} appointed ${target.name} as Validator`,
    });

    return NextResponse.json({
      message: "Validator updated successfully",
      member: target,
    });
  } catch (err) {
    console.error(err);

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

    const { id } = await params;

    const data = await getAdmin(req, id);

    if (!data)
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );

    const { admin, target, userId } = data;

    if (target.role === "Admin")
      return NextResponse.json(
        { message: "Leader cannot be removed" },
        { status: 400 }
      );

    const groups = await GroupMember.find(
      { membershipId: target._id },
      "groupId"
    );

    await GroupMember.deleteMany({
      membershipId: target._id,
    });

    await Promise.all(
      groups.map(async (g) => {
        const total = await GroupMember.countDocuments({
          groupId: g.groupId,
        });

        return Group.findByIdAndUpdate(g.groupId, {
          members: total,
        });
      })
    );

    await Promise.all([
      Membership.findByIdAndDelete(id),

      Organization.findByIdAndUpdate(target.organizationId, {
        $pull: { members: target.userId },
      }),

      History.create({
        organizationId: target.organizationId,
        userId,
        type: "APPROVAL",
        title: "Member Removed",
        description: `${admin.name} removed ${target.name} from the organization`,
      }),
    ]);

    return NextResponse.json({
      message: "Member removed successfully",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}