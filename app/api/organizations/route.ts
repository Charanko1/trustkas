import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Organization from "@/models/Organization";
import Membership from "@/models/Membership";
import User from "@/models/User";

const getUserId = (req: NextRequest) => {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  return (verifyToken(token) as { id: string }).id;
};

const generateInviteCode = (name: string) =>
  `${name.replace(/[^A-Za-z]/g, "").toUpperCase().slice(0, 4)}-${Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()}`;

async function generateUniqueSlug(base: string) {
  let slug = base;
  let i = 1;

  while (await Organization.exists({ slug })) {
    slug = `${base}-${i++}`;
  }

  return slug;
}

// ================= GET =================
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = getUserId(req);
    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const organizations = await Membership.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: "organizations",
          localField: "organizationId",
          foreignField: "_id",
          as: "organization",
        },
      },
      { $unwind: "$organization" },
      {
        $project: {
          _id: "$organization._id",
          name: "$organization.name",
          slug: "$organization.slug",
          description: "$organization.description",
          treasury: "$organization.treasury",
          members: { $size: "$organization.members" },
          owner: "$organization.owner",
          code: "$organization.code",
        },
      },
    ]);

    return NextResponse.json(organizations);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ================= POST =================
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = getUserId(req);
    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const user = await User.findById(userId).lean();
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const slug = await generateUniqueSlug(
      body.slug.toLowerCase().trim().replace(/\s+/g, "-")
    );

    const organization = await Organization.create({
      name: body.name,
      slug,
      description: body.description,
      code: generateInviteCode(body.name),
      treasury: 0,
      owner: userId,
      members: [userId],
    });

    await Membership.create({
      organizationId: organization._id,
      userId,
      name: user.name,
      walletAddress: user.walletAddress,
      role: "Admin",
    });

    return NextResponse.json(
      {
        message: "Organization created",
        organization,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}