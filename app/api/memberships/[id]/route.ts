import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
<<<<<<< HEAD
import { verifyToken } from "@/lib/auth";

=======
import { getAuthenticatedUser, AuthenticationError, authErrorResponse } from "@/lib/server-auth";
>>>>>>> master
import Membership from "@/models/Membership";
import History from "@/models/History";
import Organization from "@/models/Organization";
import Group from "@/models/Group";
import GroupMember from "@/models/GroupMember";
<<<<<<< HEAD

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
=======
import GroupJoinRequest from "@/models/GroupJoinRequest";
import Proposal from "@/models/Proposal";

async function getAdminContext(userId: string, membershipId: string) {
  const target = await Membership.findById(membershipId);
  if (!target) return null;
  const admin = await Membership.findOne({ organizationId: target.organizationId, userId, role: "Admin" });
  return admin ? { admin, target } : null;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(req);
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const data = await getAdminContext(user._id.toString(), id);
    if (!data) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    const role = body.role;
    if (role !== "Member") return NextResponse.json({ message: "Validator roles are managed per group." }, { status: 400 });
    if (data.target.role === "Admin") return NextResponse.json({ message: "Organization admin role cannot be changed here." }, { status: 400 });
    data.target.role = role;
    await data.target.save();
    await History.create({ organizationId: data.target.organizationId, userId: user._id.toString(), type: "APPROVAL", title: "Organization Role Updated", description: `${user.name} updated ${data.target.name}'s organization role.` });
    return NextResponse.json({ message: "Member role updated successfully", member: data.target });
  } catch (error) {
    if (error instanceof AuthenticationError) return authErrorResponse(error);
    console.error("UPDATE MEMBERSHIP ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(req);
    const { id } = await params;
    const data = await getAdminContext(user._id.toString(), id);
    if (!data) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    if (data.target.role === "Admin") return NextResponse.json({ message: "Organization admin cannot be removed." }, { status: 400 });

    const groups = await GroupMember.find({ membershipId: data.target._id }, "groupId").lean();
    const groupIds = groups.map((g) => g.groupId);
    const activeOwnedProposal = await Proposal.exists({
      groupId: { $in: groupIds },
      creatorId: data.target.userId,
      blockchainStatus: { $in: ["CREATED", "APPROVED"] },
    });
    if (activeOwnedProposal) return NextResponse.json({ message: "This member owns an active blockchain fundraising proposal and cannot be removed until it is cancelled or released." }, { status: 409 });

    await GroupJoinRequest.deleteMany({ membershipId: data.target._id, status: { $ne: "Approved" } });
    await GroupMember.deleteMany({ membershipId: data.target._id });
    await Promise.all(groupIds.map(async (groupId) => {
      const total = await GroupMember.countDocuments({ groupId });
      await Group.findByIdAndUpdate(groupId, { members: total });
    }));
    await Membership.findByIdAndDelete(id);
    await Organization.findByIdAndUpdate(data.target.organizationId, { $pull: { members: data.target.userId } });
    await History.create({ organizationId: data.target.organizationId, userId: user._id.toString(), type: "APPROVAL", title: "Member Removed", description: `${user.name} removed ${data.target.name} from the organization.` });
    return NextResponse.json({ message: "Member removed successfully" });
  } catch (error) {
    if (error instanceof AuthenticationError) return authErrorResponse(error);
    console.error("DELETE MEMBERSHIP ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
>>>>>>> master
