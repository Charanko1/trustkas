import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Proposal from "@/models/Proposal";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const { amount, donor, txHash } = await req.json();

    const proposal = await Proposal.findByIdAndUpdate(
      id,
      {
        $inc: { fundedAmount: amount },
        $push: {
          transactions: {
            amount,
            donor,
            txHash,
            donatedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!proposal) {
      return NextResponse.json(
        { message: "Proposal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Donation recorded successfully",
      proposal,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}