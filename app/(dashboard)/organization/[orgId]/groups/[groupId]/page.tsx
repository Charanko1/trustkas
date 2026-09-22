"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, Plus, Users } from "lucide-react";
import CreateProposalModal from "@/components/proposal/CreateProposalModal";

interface Member {
  _id: string;
  name: string;
  role: string;
  walletAddress?: string;
}

interface GroupData {
  _id: string;
  name: string;
  description: string;
  leader: string;
  organizationName: string;
  members: number;
  totalProposal: number;
  isLeader: boolean;
}

interface Proposal {
  _id: string;
  title: string;
  description: string;
  creator: string;
  targetAmount: number;
  fundedAmount: number;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy: string;
  approvedAt?: string;
}

export default function GroupPage() {
  const params = useParams();

  const orgId = params.orgId as string;
  const groupId = params.groupId as string;

  const [tab, setTab] = useState("proposal");
  const [open, setOpen] = useState(false);

  const [group, setGroup] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const [currentRole, setCurrentRole] = useState<"Admin" | "Member">("Member");

  useEffect(() => {
    fetchData();
  }, [groupId]);

  async function fetchData() {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const [groupRes, proposalRes, memberRes] = await Promise.all([
      fetch(`/api/groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch(`/api/proposals?group=${groupId}`),
      fetch(`/api/groups/${groupId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    const groupData = await groupRes.json();
    const proposalData = await proposalRes.json();
    const memberData = await memberRes.json();

    setGroup(groupData);
    setCurrentRole(groupData.isLeader ? "Admin" : "Member");

    setProposals(Array.isArray(proposalData) ? proposalData : []);
    setMembers(Array.isArray(memberData) ? memberData : []);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}

  async function createProposal(proposal: {
    title: string;
    description: string;
    target: number;
    deadline: string;
  }) {
    await fetch("/api/proposals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: proposal.title,
        description: proposal.description,
        targetAmount: proposal.target,
        deadline: proposal.deadline,
        groupId,
      }),
    });

    setOpen(false);
    fetchData();
  }

  async function updateProposalStatus(
    id: string,
    status: "Approved" | "Rejected"
  ) {
    await fetch(`/api/proposals/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        validator: "{group?.leader}",
      }),
    });

    fetchData();
  }

  return (
    <>
      <CreateProposalModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={createProposal}
      />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            {group?.name}
          </h1>

          <p className="text-gray-500">
            {group?.organizationName}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b">
          {["proposal", "members", "about"].map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`pb-3 capitalize font-medium transition ${
                tab === item
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* ================= PROPOSAL ================= */}
        {tab === "proposal" && (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">
                  Proposal Board
                </h2>

                <p className="text-sm text-gray-500">
                  Create and manage fundraising proposals
                </p>
              </div>

              <button
                onClick={() => setOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <Plus size={18}/>
                New Proposal
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
                Loading proposals...
              </div>
            ) : proposals.length === 0 ? (
              <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
                No proposal yet.
              </div>
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal) => {
                  const percentage = Math.round(
                    (proposal.fundedAmount /
                      proposal.targetAmount) *
                      100
                  );

                  return (
                    <div
                      key={proposal._id}
                      className="bg-white border rounded-xl p-5"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">
                            {proposal.title}
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            By {proposal.creator}
                          </p>
                        </div>

                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            proposal.status === "Approved"
                              ? "bg-green-100 text-green-600"
                              : proposal.status === "Rejected"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {proposal.status}
                        </span>
                      </div>

                      {/* Progress */}
                      <div className="mt-5">
                        <div className="flex justify-between text-sm mb-2">
                          <span>
                            {proposal.fundedAmount} /{" "}
                            {proposal.targetAmount} POL
                          </span>

                          <span>{percentage}%</span>
                        </div>

                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Validator Info */}
                      {proposal.status === "Approved" &&
                        proposal.approvedBy && (
                          <div className="mt-4 bg-green-50 border border-green-100 rounded-lg px-3 py-2 text-sm text-green-700">
                            Approved by{" "}
                            <span className="font-semibold">
                              {proposal.approvedBy}
                            </span>
                          </div>
                        )}

                      {proposal.status === "Rejected" &&
                        proposal.approvedBy && (
                          <div className="mt-4 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm text-red-700">
                            Rejected by{" "}
                            <span className="font-semibold">
                              {proposal.approvedBy}
                            </span>
                          </div>
                        )}

                      {/* Actions */}
                      <div className="mt-5 flex gap-3 flex-wrap">
                        <Link
                          href={`/organization/${orgId}/groups/${groupId}/proposal/${proposal._id}`}
                        >
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            View Detail
                          </button>
                        </Link>

                        {proposal.status === "Approved" && (
                          <button className="border px-4 py-2 rounded-lg hover:bg-gray-50">
                            Donate POL
                          </button>
                        )}

                        {proposal.status === "Pending" &&
                          currentRole === "Admin" && (
                            <>
                              <button
                                onClick={() =>
                                  updateProposalStatus(
                                    proposal._id,
                                    "Approved"
                                  )
                                }
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                              >
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  updateProposalStatus(
                                    proposal._id,
                                    "Rejected"
                                  )
                                }
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ================= MEMBERS ================= */}
        {tab === "members" && (
          <div className="space-y-4">
            {members.length === 0 ? (
              <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
                No members in this group.
              </div>
            ) : (
              members.map((member) => (
                <div
                  key={member._id}
                  className="bg-white border rounded-xl p-4 flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {member.name.charAt(0)}
                    </div>

                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.role}</p>

                      {member.walletAddress && (
                        <p className="text-xs text-gray-400">
                          {member.walletAddress}
                        </p>
                      )}
                    </div>
                  </div>

                  {member.role === "Admin" && (
                    <CheckCircle className="text-green-600" />
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ================= ABOUT ================= */}
        {tab === "about" && (
          <div className="bg-white border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold">
              About Group
            </h2>

            <p className="text-gray-600">
              {group?.name} manages seminars, workshops,
              competitions, and every proposal related to
              organization events.
            </p>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Leader
                </span>
                <span>{group?.leader}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Members
                </span>
                <span>{group?.members ?? 0}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Organization
                </span>
                <span>{group?.organizationName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Total Proposal
                </span>
                <span>{group?.totalProposal ?? 0}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}