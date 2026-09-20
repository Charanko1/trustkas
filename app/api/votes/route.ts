import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Vote from "@/models/Vote";
import Candidate from "@/models/Candidate";

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();

  try {
    // simpan vote
    await Vote.create({
      electionId: body.electionId,
      candidateId: body.candidateId,
      voterId: body.voterId,
    });

    // tambah jumlah vote kandidat
    await Candidate.findByIdAndUpdate(
      body.candidateId,
      { $inc: { votes: 1 } }
    );

    return NextResponse.json({
      message: "Vote Success",
    });
  } catch {
    return NextResponse.json(
      { message: "You already voted." },
      { status: 400 }
    );
  }
}