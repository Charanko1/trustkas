import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";

async function getUserFromToken(req: NextRequest) {
  const token = req.headers
    .get("authorization")
    ?.replace("Bearer ", "");

  if (!token) return null;

  const payload = verifyToken(token) as { id: string };
  return payload.id;
}

// =======================
// GET PROFILE
// =======================
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = await getUserFromToken(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// =======================
// UPDATE PROFILE
// =======================
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const userId = await getUserFromToken(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const updateData: any = {};

    if (body.name) updateData.name = body.name;
    if (body.walletAddress)
      updateData.walletAddress = body.walletAddress;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}