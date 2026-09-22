import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Organization from "@/models/Organization";
import Membership from "@/models/Membership";
import User from "@/models/User";

function generateInviteCode(name: string) {
  const prefix = name
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase()
    .slice(0, 4);

  const random = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  return `${prefix}-${random}`;
}

async function generateUniqueSlug(baseSlug: string) {
  let slug = baseSlug;
  let count = 1;

  while (await Organization.findOne({ slug }).lean()) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
}

// =======================
// GET MY ORGANIZATIONS
// =======================
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const auth = req.headers.get("authorization");

    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(auth.slice(7)) as {
      id: string;
    };

    // 1 QUERY SAJA
    const organizations = await Membership.aggregate([
      {
        $match: {
          userId: payload.id,
        },
      },
      {
        $lookup: {
          from: "organizations",
          localField: "organizationId",
          foreignField: "_id",
          as: "organization",
        },
      },
      {
        $unwind: "$organization",
      },
      {
        $project: {
          _id: "$organization._id",
          name: "$organization.name",
          slug: "$organization.slug",
          description: "$organization.description",
          treasury: "$organization.treasury",
          members: {
            $size: "$organization.members",
          },
          owner: "$organization.owner",
          code: "$organization.code",
        },
      },
    ]);

    return NextResponse.json(organizations);
  } catch (error) {
    console.error("GET ORGANIZATIONS:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// =======================
// CREATE ORGANIZATION
// =======================
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const auth = req.headers.get("authorization");

    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(auth.slice(7)) as {
      id: string;
    };

    const currentUser = await User.findById(payload.id).lean();

    if (!currentUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const baseSlug = body.slug
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    const slug = await generateUniqueSlug(baseSlug);

    const inviteCode = generateInviteCode(body.name);

    const organization = await Organization.create({
      name: body.name,
      slug,
      description: body.description,
      code: inviteCode,
      treasury: 0,
      owner: payload.id,
      members: [payload.id],
    });

    await Membership.create({
      organizationId: organization._id,
      userId: payload.id,
      name: currentUser.name,
      walletAddress: currentUser.walletAddress,
      role: "Admin",
    });

    return NextResponse.json(
      {
        message: "Organization created",
        organization,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("CREATE ORGANIZATION:", error);

    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}