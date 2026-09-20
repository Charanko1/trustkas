import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Membership from "@/models/Membership";

export async function GET(req: NextRequest) {
  await connectDB();

  const organizationId =
    new URL(req.url).searchParams.get("organization");

  const members = await Membership.find({
    organizationId,
  }).sort({ createdAt: 1 });

  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();

  try {
    const member = await Membership.create(body);

    return NextResponse.json(member);
  } catch {
    return NextResponse.json(
      { message: "Member already exists." },
      { status: 400 }
    );
  }
}