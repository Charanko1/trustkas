import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
<<<<<<< HEAD
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

=======
import { getAuthenticatedUser, AuthenticationError, authErrorResponse } from "@/lib/server-auth";
import Membership from "@/models/Membership";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(req);
>>>>>>> master
    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
<<<<<<< HEAD
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

=======
      walletAddress: user.walletAddress || "",
      walletVerifiedAt: user.walletVerifiedAt,
    });
  } catch (error) {
    if (error instanceof AuthenticationError) return authErrorResponse(error);
    console.error("GET PROFILE ERROR:", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthenticatedUser(req);
    const body = await req.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name || name.length > 100) return NextResponse.json({ message: "A valid name is required." }, { status: 400 });

    user.name = name;
    await user.save();
    await Membership.updateMany({ userId: user._id.toString() }, { name });
>>>>>>> master
    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
<<<<<<< HEAD
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
=======
      walletAddress: user.walletAddress || "",
      walletVerifiedAt: user.walletVerifiedAt,
    });
  } catch (error) {
    if (error instanceof AuthenticationError) return authErrorResponse(error);
    console.error("UPDATE PROFILE ERROR:", error);
    return NextResponse.json({ message: "Could not update profile." }, { status: 500 });
  }
}
>>>>>>> master
