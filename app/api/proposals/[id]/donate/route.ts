import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Proposal from "@/models/Proposal";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const { amount, donor, txHash } = await req.json();

    const proposal = await Proposal.findById(id);

    if (!proposal) {
      return NextResponse.json(
        { message: "Proposal not found" },
        { status: 404 }
      );
    }

    proposal.fundedAmount += amount;

    proposal.transactions.push({
      amount,
      donor,
      txHash,
      donatedAt: new Date(),
    });

    await proposal.save();

    return NextResponse.json({
      message: "Donation recorded successfully",
      proposal,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}