import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
<<<<<<< HEAD
import { verifyToken } from "@/lib/auth";

import Membership from "@/models/Membership";
import GroupJoinRequest from "@/models/GroupJoinRequest";
=======
import { getAuthenticatedUser, AuthenticationError, authErrorResponse } from "@/lib/server-auth";
import Membership from "@/models/Membership";
import GroupJoinRequest from "@/models/GroupJoinRequest";
import Organization from "@/models/Organization";
>>>>>>> master

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

    const { id } = verifyToken(token) as { id: string };

    const adminMemberships = await Membership.find(
      { userId: id, role: "Admin" },
      "organizationId"
    ).lean();

    const organizationIds = adminMemberships.map((m: any) => m.organizationId);

=======
    const user = await getAuthenticatedUser(req);
    const requestedOrganization = req.nextUrl.searchParams.get("organization")?.trim();

    const adminMemberships = await Membership.find({ userId: user._id.toString(), role: "Admin" }, "organizationId").lean();
    let organizationIds = adminMemberships.map((m: any) => m.organizationId);

    if (requestedOrganization) {
      const organization = await Organization.findOne({ slug: requestedOrganization }, "_id").lean();
      if (!organization) return NextResponse.json([]);
      organizationIds = organizationIds.filter((id: any) => String(id) === String(organization._id));
    }
>>>>>>> master
    if (!organizationIds.length) return NextResponse.json([]);

    const requests = await GroupJoinRequest.aggregate([
      { $match: { status: "Pending" } },
<<<<<<< HEAD

      {
        $lookup: {
          from: "groups",
          localField: "groupId",
          foreignField: "_id",
          as: "group",
        },
      },
      { $unwind: "$group" },
      { $match: { "group.organizationId": { $in: organizationIds } } },

      {
        $lookup: {
          from: "memberships",
          localField: "membershipId",
          foreignField: "_id",
          as: "member",
        },
      },
      { $unwind: "$member" },

      {
        $project: {
          _id: 1,
          membershipId: "$member._id",
          memberName: "$member.name",
          walletAddress: "$member.walletAddress",
          groupId: "$group._id",
          groupName: "$group.name",
          createdAt: 1,
        },
      },

      { $sort: { createdAt: -1 } },
    ]);

    return NextResponse.json(requests);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
=======
      { $lookup: { from: "groups", localField: "groupId", foreignField: "_id", as: "group" } },
      { $unwind: "$group" },
      { $match: { "group.organizationId": { $in: organizationIds } } },
      { $lookup: { from: "memberships", localField: "membershipId", foreignField: "_id", as: "member" } },
      { $unwind: "$member" },
      { $project: { _id: 1, membershipId: "$member._id", memberName: "$member.name", walletAddress: "$member.walletAddress", groupId: "$group._id", groupName: "$group.name", createdAt: 1 } },
      { $sort: { createdAt: -1 } },
    ]);
    return NextResponse.json(requests);
  } catch (error) {
    if (error instanceof AuthenticationError) return authErrorResponse(error);
    console.error("GET JOIN REQUESTS ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
>>>>>>> master
