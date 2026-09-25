import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
<<<<<<< HEAD
import { verifyToken } from "@/lib/auth";

=======
import { getAuthenticatedUser, AuthenticationError, authErrorResponse } from "@/lib/server-auth";
>>>>>>> master
import Membership from "@/models/Membership";
import Organization from "@/models/Organization";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
<<<<<<< HEAD

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );

    verifyToken(token);

    const slug = req.nextUrl.searchParams.get("organization");
    if (!slug) return NextResponse.json([]);

    const organizationId = (
      await Organization.findOne({ slug }, "_id").lean()
    )?._id;

    if (!organizationId) return NextResponse.json([]);

    const members = await Membership.find(
      { organizationId },
      "name role walletAddress userId createdAt"
    )
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json(members);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
=======
    const user = await getAuthenticatedUser(req);
    const slug = req.nextUrl.searchParams.get("organization")?.trim();
    if (!slug) return NextResponse.json([]);
    const organizationId = (await Organization.findOne({ slug }, "_id").lean())?._id;
    if (!organizationId) return NextResponse.json([]);
    const allowed = await Membership.exists({ organizationId, userId: user._id.toString() });
    if (!allowed) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    const members = await Membership.find({ organizationId }, "name role walletAddress userId createdAt").sort({ createdAt: 1 }).lean();
    return NextResponse.json(members);
  } catch (error) {
    if (error instanceof AuthenticationError) return authErrorResponse(error);
    console.error("GET MEMBERSHIPS ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
>>>>>>> master
