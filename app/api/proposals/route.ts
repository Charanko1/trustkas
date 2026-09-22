import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Proposal from "@/models/Proposal";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const groupId = req.nextUrl.searchParams.get("group");
    if (!groupId) return NextResponse.json([]);

    const proposals = await Proposal.find({ groupId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(proposals);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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

    return NextResponse.json(proposal, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}