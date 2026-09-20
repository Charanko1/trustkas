import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Organization from "@/models/Organization";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;

    const organization = await Organization.findOne({ slug });

    if (!organization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      _id: organization._id,
      name: organization.name,
      slug: organization.slug,
      description: organization.description,
      treasury: organization.treasury,
      members: organization.members.length,
      owner: organization.owner,
      code: organization.code,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}