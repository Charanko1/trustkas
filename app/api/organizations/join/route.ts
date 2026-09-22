import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Organization from "@/models/Organization";
import Membership from "@/models/Membership";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  const session = await mongoose.startSession();

  try {
    await connectDB();
    session.startTransaction();

    const auth = req.headers.get("authorization");

    if (!auth?.startsWith("Bearer ")) {
      await session.abortTransaction();
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(auth.slice(7)) as {
      id: string;
    };

    const { code } = await req.json();

    const organization = await Organization.findOne({
      code: code.toUpperCase().trim(),
    }).session(session);

    if (!organization) {
      await session.abortTransaction();
      return NextResponse.json(
        { message: "Invalid invitation code" },
        { status: 404 }
      );
    }

    const existing = await Membership.findOne({
      organizationId: organization._id,
      userId: payload.id,
    }).session(session);

    if (existing) {
      await session.abortTransaction();
      return NextResponse.json(
        { message: "You are already a member" },
        { status: 400 }
      );
    }

    const user = await User.findById(payload.id)
      .select("name walletAddress")
      .lean()
      .session(session);

    if (!user) {
      await session.abortTransaction();
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    await Membership.create(
      [
        {
          organizationId: organization._id,
          userId: payload.id,
          name: user.name,
          walletAddress: user.walletAddress,
          role: "Member",
        },
      ],
      { session }
    );

    await Organization.updateOne(
      { _id: organization._id },
      {
        $addToSet: {
          members: payload.id,
        },
      },
      { session }
    );

    await session.commitTransaction();

    return NextResponse.json({
      message: "Joined successfully",
      organizationId: organization._id,
    });
  } catch (error) {
    await session.abortTransaction();

    console.error("JOIN ERROR:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}