<<<<<<< HEAD
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Organization from "@/models/Organization";
import Membership from "@/models/Membership";
import User from "@/models/User";
=======
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthenticatedUser, AuthenticationError, authErrorResponse } from "@/lib/server-auth";
import Organization from "@/models/Organization";
import Membership from "@/models/Membership";
>>>>>>> master

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await mongoose.startSession();
<<<<<<< HEAD

  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );

    const { id: userId } = verifyToken(token) as { id: string };
    const { code } = await req.json();

    session.startTransaction();

    const organization = await Organization.findOne({
      code: code.trim().toUpperCase(),
    }).session(session);

    if (!organization)
      throw new Error("Invalid invitation code");

    const member = await Membership.findOne({
      organizationId: organization._id,
      userId,
    }).session(session);

    if (member)
      throw new Error("You are already a member");

    const user = await User.findById(userId)
      .select("name walletAddress")
      .session(session);

    if (!user)
      throw new Error("User not found");

    await Membership.create(
      [
        {
          organizationId: organization._id,
          userId,
          name: user.name,
          walletAddress: user.walletAddress,
          role: "Member",
        },
      ],
      { session }
    );

    await Organization.updateOne(
      { _id: organization._id },
      { $addToSet: { members: userId } },
      { session }
    );

    await session.commitTransaction();

    return NextResponse.json({
      message: "Joined successfully",
      organizationId: organization._id,
    });
  } catch (err: any) {
    await session.abortTransaction();

    const status =
      err.message === "Invalid invitation code"
        ? 404
        : err.message === "You are already a member"
        ? 400
        : err.message === "User not found"
        ? 404
        : 500;

    return NextResponse.json(
      { message: status === 500 ? "Internal Server Error" : err.message },
      { status }
    );
  } finally {
    session.endSession();
  }
}
=======
  try {
    const user = await getAuthenticatedUser(req);
    const body = await req.json().catch(() => ({}));
    const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
    if (!code) return NextResponse.json({ message: "Invitation code is required." }, { status: 400 });

    let organizationId = "";
    await session.withTransaction(async () => {
      const organization = await Organization.findOne({ code }).session(session);
      if (!organization) throw new Error("Invalid invitation code");
      const member = await Membership.findOne({ organizationId: organization._id, userId: user._id.toString() }).session(session);
      if (member) throw new Error("You are already a member");

      await Membership.create([{ organizationId: organization._id, userId: user._id.toString(), name: user.name, walletAddress: user.walletAddress || "", role: "Member" }], { session });
      await Organization.updateOne({ _id: organization._id }, { $addToSet: { members: user._id } }, { session });
      organizationId = organization._id.toString();
    });

    return NextResponse.json({ message: "Joined successfully", organizationId });
  } catch (error) {
    if (error instanceof AuthenticationError) return authErrorResponse(error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    const status = message === "Invalid invitation code" ? 404 : message === "You are already a member" ? 400 : 500;
    return NextResponse.json({ message: status === 500 ? "Internal Server Error" : message }, { status });
  } finally {
    await session.endSession();
  }
}
>>>>>>> master
