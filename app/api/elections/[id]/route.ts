import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import Election from "@/models/Election";
import Candidate from "@/models/Candidate";
import Membership from "@/models/Membership";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  const election = await Election.findById(id);

  if (!election) {
    return NextResponse.json(
      { message: "Election not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(election);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;
  const body = await req.json();

  const election = await Election.findById(id);

  if (!election) {
    return NextResponse.json(
      { message: "Election not found" },
      { status: 404 }
    );
  }

  // ===== START VOTING =====
  if (body.status === "Voting") {
    election.status = "Voting";
    await election.save();

    return NextResponse.json(election);
  }

  // ===== CLOSE ELECTION =====
  if (body.status === "Closed") {
    // Cari kandidat dengan vote terbanyak
    const winner = await Candidate.findOne({
      electionId: election._id,
    }).sort({ votes: -1 });

    // Jadikan validator organisasi
    if (winner) {
      await Membership.findOneAndUpdate(
        {
          organizationId: election.organizationId,
          userId: winner.userId,
        },
        {
          role: "Validator",
        },
        {
          new: true,
        }
      );
    }

    election.status = "Closed";
    await election.save();

    return NextResponse.json({
      message: "Election closed successfully",
      winner,
      election,
    });
  }

  // Update status lain
  election.status = body.status;
  await election.save();

  return NextResponse.json(election);
}