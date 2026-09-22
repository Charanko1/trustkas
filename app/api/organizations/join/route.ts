import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Organization from "@/models/Organization";
import Membership from "@/models/Membership";
import User from "@/models/User";

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

    const { code } = await req.json();

    const organization = await Organization.findOne({
      code: code.toUpperCase(),
    });

    if (!organization) {
      return NextResponse.json(
        { message: "Invalid invitation code" },
        { status: 404 }
      );
    }

    const exist = await Membership.findOne({
      organizationId: organization._id,
      userId: payload.id,
    });

    if (exist) {
      return NextResponse.json(
        { message: "You are already a member" },
        { status: 400 }
      );
    }

    const user = await User.findById(payload.id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    await Membership.create({
      organizationId: organization._id,
      userId: payload.id,
      name: user.name,
      walletAddress: user.walletAddress,
      role: "Member",
    });

    organization.members.push(payload.id);
    await organization.save();

    return NextResponse.json({
      message: "Joined successfully",
      organization,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}