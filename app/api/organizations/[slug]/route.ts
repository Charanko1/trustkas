import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Organization from "@/models/Organization";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  await connectDB();

  const { slug } = await params;

  const organization = await Organization.findOne({ slug });

  if (!organization) {
    return NextResponse.json(
      { message: "Organization not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(organization);
}