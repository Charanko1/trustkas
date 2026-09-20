import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Election from "@/models/Election";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const organizationId =
    searchParams.get("organization");

  const elections = await Election.find({
    organizationId,
  }).sort({ createdAt: -1 });

  return NextResponse.json(elections);
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const election = await Election.create(body);

  return NextResponse.json(election);
}