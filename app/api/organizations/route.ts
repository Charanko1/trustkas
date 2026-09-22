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

  while (await Organization.findOne({ slug })) {
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

    const memberships = await Membership.find({
      userId: payload.id,
    });

    const organizationIds = memberships.map(
      (m) => m.organizationId
    );

    const organizations = await Organization.find({
      _id: { $in: organizationIds },
    });

    const result = organizations.map((org) => ({
      _id: org._id,
      name: org.name,
      slug: org.slug,
      description: org.description,
      treasury: org.treasury,
      members: Array.isArray(org.members)
        ? org.members.length
        : 0,
      code: org.code,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

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

    const currentUser = await User.findById(payload.id);

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
    console.error(error);

    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}