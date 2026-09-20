import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Proposal from "@/models/Proposal";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const groupId = searchParams.get("group");

  const proposals = await Proposal.find({
    groupId,
  }).sort({ createdAt: -1 });

  return NextResponse.json(proposals);
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const proposal = await Proposal.create({
    title: body.title,
    description: body.description,
    targetAmount: body.targetAmount,
    deadline: body.deadline,
    groupId: body.groupId,
    creator: "Ridwan Aziz",
  });

  return NextResponse.json(proposal, {
    status: 201,
  });
}