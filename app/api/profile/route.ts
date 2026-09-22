import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";

async function getUserId(req: NextRequest) {
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

    const userId = await getUserId(req);

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

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
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
// UPDATE PROFILE
// =======================
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const userId = await getUserId(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...(body.name && { name: body.name }),
        ...(body.walletAddress && {
          walletAddress: body.walletAddress,
        }),
      },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}