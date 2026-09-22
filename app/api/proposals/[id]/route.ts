import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Proposal from "@/models/Proposal";

interface Params {
  params: Promise<{ id: string }>;
}

// ================= GET =================
export async function GET(
  req: NextRequest,
  { params }: Params
) {
  try {
    await connectDB();

    const { id } = await params;

    const proposal = await Proposal.findById(id).lean();

    if (!proposal) {
      return NextResponse.json(
        { message: "Proposal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(proposal);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ================= PATCH =================
export async function PATCH(
  req: NextRequest,
  { params }: Params
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    const proposal = await Proposal.findByIdAndUpdate(
      id,
      {
        status: body.status,
        approvedBy: body.validator,
        approvedAt: new Date(),
      },
      { new: true }
    );

    if (!proposal) {
      return NextResponse.json(
        { message: "Proposal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(proposal);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ================= DELETE =================
export async function DELETE(
  req: NextRequest,
  { params }: Params
) {
  try {
    await connectDB();

    const { id } = await params;

    await Proposal.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Proposal deleted successfully",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}