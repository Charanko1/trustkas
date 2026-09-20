import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Group from "@/models/Group";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

  const group = await Group.findById(id);

  if (!group) {
    return NextResponse.json(
      { message: "Group not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(group);
}