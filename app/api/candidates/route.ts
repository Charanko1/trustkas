import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Candidate from "@/models/Candidate";

export async function GET(req: NextRequest) {
  await connectDB();

  const electionId =
    new URL(req.url).searchParams.get("election");

  const candidates = await Candidate.find({
    electionId,
  }).sort({ votes: -1 });

  return NextResponse.json(candidates);
}

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();

  const candidate = await Candidate.create(body);

  return NextResponse.json(candidate);
}