import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Organization from "@/models/Organization";
import Membership from "@/models/Membership";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await mongoose.startSession();

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