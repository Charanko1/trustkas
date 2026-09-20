import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import Organization from "@/models/Organization";
import Membership from "@/models/Membership";

export async function GET() {
  await connectDB();

  const organizations = await Organization.find();

  return NextResponse.json(organizations);
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  // Buat organization
  const organization = await Organization.create({
    name: body.name,
    slug: body.slug,
    description: body.description,
    treasury: 0,
    members: 1,
    owner: "wallet-demo",
  });

  // Creator otomatis menjadi Admin
  await Membership.create({
    organizationId: organization._id,
    userId: "demo-user",
    name: "Ridwan Aziz",
    walletAddress: "wallet-demo",
    role: "Admin",
  });

  return NextResponse.json(organization, {
    status: 201,
  });
}