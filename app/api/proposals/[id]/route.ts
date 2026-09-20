import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Proposal from "@/models/Proposal";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// ================= GET =================
export async function GET(
  req: NextRequest,
  { params }: Params
) {
  await connectDB();

  const { id } = await params;

  const proposal = await Proposal.findById(id);

  if (!proposal) {
    return NextResponse.json(
      { message: "Proposal not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(proposal);
}

// ================= PATCH =================
export async function PATCH(
  req: NextRequest,
  { params }: Params
) {
  await connectDB();

  const { id } = await params;
  const body = await req.json();

  const proposal = await Proposal.findById(id);

  if (!proposal) {
    return NextResponse.json(
      { message: "Proposal not found" },
      { status: 404 }
    );
  }

  proposal.status = body.status;
  proposal.approvedBy = body.validator;
  proposal.approvedAt = new Date();

  await proposal.save();

  return NextResponse.json(proposal);
}

// ================= DELETE =================
export async function DELETE(
  req: NextRequest,
  { params }: Params
) {
  await connectDB();

  const { id } = await params;

  await Proposal.findByIdAndDelete(id);

  return NextResponse.json({
    message: "Proposal deleted successfully",
  });
}