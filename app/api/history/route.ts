import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
<<<<<<< HEAD
import { verifyToken } from "@/lib/auth";

import History from "@/models/History";
import Membership from "@/models/Membership";
=======
import { getAuthenticatedUser, AuthenticationError, authErrorResponse } from "@/lib/server-auth";
import Membership from "@/models/Membership";
import History from "@/models/History";
>>>>>>> master

export async function GET(req: NextRequest) {
  try {
    await connectDB();
<<<<<<< HEAD

    const token = req.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token) as { id: string };

    // Cari semua organisasi yang diikuti user
    const memberships = await Membership.find({
      userId: payload.id,
    });

    const organizationIds = memberships.map(
      (m) => m.organizationId
    );

    // Ambil seluruh history organisasi tersebut
    const histories = await History.find({
      organizationId: { $in: organizationIds },
    }).sort({ createdAt: -1 });

    return NextResponse.json(histories);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
=======
    const user = await getAuthenticatedUser(req);
    const memberships = await Membership.find({ userId: user._id.toString() }, "organizationId").lean();
    const organizationIds = memberships.map((m: any) => m.organizationId);
    if (!organizationIds.length) return NextResponse.json([]);
    const histories = await History.find({ organizationId: { $in: organizationIds } })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return NextResponse.json(histories);
  } catch (error) {
    if (error instanceof AuthenticationError) return authErrorResponse(error);
    console.error("GET HISTORY ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
>>>>>>> master
