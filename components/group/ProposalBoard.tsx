"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import CreateProposalModal from "@/components/proposal/CreateProposalModal";
import type { Proposal, GroupData } from "@/types/group";

interface CreateProposalData {
  title: string;
  description: string;
  target: number;
  deadline: string;
}

interface Props {
  proposals?: Proposal[];
  currentRole: "Admin" | "Member";
  group: GroupData;
  orgId: string;
  groupId: string;

  onCreate: (proposal: CreateProposalData) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function ProposalBoard({
  proposals,
  currentRole,
  group,
  orgId,
  groupId,
  onCreate,
  onApprove,
  onReject,
}: Props) {
  const [open, setOpen] = useState(false);

  // FIX: cegah undefined
  const proposalList = Array.isArray(proposals) ? proposals : [];

  return (
    <>
      <CreateProposalModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={(data) => {
          onCreate(data);
          setOpen(false);
        }}
      />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Proposal Board</h2>
          <p className="text-sm text-gray-500">
            Create and manage fundraising proposals
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} />
          New Proposal
        </button>
      </div>

      {proposalList.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center text-gray-500">
          No proposal yet.
        </div>
      ) : (
        <div className="space-y-4">
          {proposalList.map((proposal) => {
            const percentage =
              proposal.targetAmount <= 0
                ? 0
                : Math.min(
                    100,
                    Math.round(
                      (proposal.fundedAmount / proposal.targetAmount) * 100
                    )
                  );

            return (
              <div
                key={proposal._id}
                className="bg-white border rounded-xl p-5"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{proposal.title}</h3>
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
                      {proposal.fundedAmount} / {proposal.targetAmount} POL
                    </span>
                    <span>{percentage}%</span>
                  </div>

                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Validator */}
                {proposal.status === "Approved" && proposal.approvedBy && (
                  <div className="mt-4 bg-green-50 border border-green-100 rounded-lg px-3 py-2 text-sm text-green-700">
                    Approved by{" "}
                    <span className="font-semibold">
                      {proposal.approvedBy}
                    </span>
                  </div>
                )}

                {proposal.status === "Rejected" && proposal.approvedBy && (
                  <div className="mt-4 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm text-red-700">
                    Rejected by{" "}
                    <span className="font-semibold">
                      {proposal.approvedBy}
                    </span>
                  </div>
                )}

                {/* Action */}
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
                          onClick={() => onApprove(proposal._id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => onReject(proposal._id)}
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
  );
}