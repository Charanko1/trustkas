import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Group from "@/models/Group";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const organization = searchParams.get("organization");

  const groups = await Group.find({
    organizationSlug: organization,
  });

  return NextResponse.json(groups);
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const group = await Group.create({
    name: body.name,
    description: body.description,
    organizationSlug: body.organizationSlug,
    leader: "Ridwan Aziz",
    members: 1,
  });

  return NextResponse.json(group, {
    status: 201,
  });
}