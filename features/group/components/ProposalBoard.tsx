"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
<<<<<<< HEAD

import dynamic from "next/dynamic";
const CreateProposalModal = dynamic(() => import("@/features/proposal/components/CreateProposalModal"));
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

  onCreate: (proposal: CreateProposalData) => Promise<void>;
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
      {open && <CreateProposalModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={onCreate}
      />}

      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Proposal Board</h2>
          <p className="text-sm text-gray-500">
            Create and manage fundraising proposals
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-none flex items-center gap-2 hover:bg-primary-hover border-2 border-foreground shadow-brutal"
        >
          <Plus size={18} />
          New Proposal
        </button>
      </div>

      {proposalList.length === 0 ? (
        <div className="bg-white rounded-none border p-8 text-center text-gray-500 shadow-brutal">
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
                className="bg-white border rounded-none p-5 shadow-brutal"
              >
                {/* Header */}
                <div className="flex flex-wrap gap-3 justify-between items-start">
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
                  <div className="flex flex-wrap gap-3 justify-between text-sm mb-2">
                    <span>
                      {proposal.fundedAmount} / {proposal.targetAmount} BOT
                    </span>
                    <span>{percentage}%</span>
                  </div>

                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Validator */}
                {proposal.status === "Approved" && proposal.approvedBy && (
                  <div className="mt-4 bg-green-50 border border-green-100 rounded-none px-3 py-2 text-sm text-green-700 shadow-brutal">
                    Approved by{" "}
                    <span className="font-semibold">
                      {proposal.approvedBy}
                    </span>
                  </div>
                )}

                {proposal.status === "Rejected" && proposal.approvedBy && (
                  <div className="mt-4 bg-red-50 border border-red-100 rounded-none px-3 py-2 text-sm text-red-700 shadow-brutal">
                    Rejected by{" "}
                    <span className="font-semibold">
                      {proposal.approvedBy}
                    </span>
                  </div>
                )}

                {/* Action */}
                <div className="mt-5 flex gap-3 flex-wrap">
                  <Link href={`/organization/${orgId}/groups/${groupId}/proposal/${proposal._id}`} className="bg-primary text-white px-4 py-2 rounded-none hover:bg-primary-hover border-2 border-foreground shadow-brutal">
                      View Detail
                    </Link>

                  {proposal.status === "Approved" && (
                    <Link href={`/organization/${orgId}/groups/${groupId}/proposal/${proposal._id}`} className="pledgr-button pledgr-button-secondary">
                      Contribute
                    </Link>
                  )}

                  {proposal.status === "Pending" &&
                    currentRole === "Admin" && (
                      <>
                        <button
                          onClick={() => onApprove(proposal._id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-none hover:bg-green-700"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => onReject(proposal._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-none hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
=======
import dynamic from "next/dynamic";
import type { CreateProposalData, GroupData, GroupRole, Proposal } from "@/types/group";
import { useWallet } from "@/context/WalletContext";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { formatBotAmount, fundingPercentage } from "@/lib/bot";

const CreateProposalModal = dynamic(() => import("@/features/proposal/components/CreateProposalModal"));

interface Props {
  proposals?: Proposal[];
  currentRole: GroupRole;
  currentUserId?: string;
  group: GroupData;
  orgId: string;
  groupId: string;
  onCreate: (data: CreateProposalData) => Promise<void>;
  onDelete: (id: string) => void;
  onValidate: (id: string, action: "approve" | "reject") => void;
  onAdminReview: (id: string, action: "approve" | "reject") => void;
  onRegisterOnChain: (id: string) => void;
  onActivateFunding: (id: string) => void;
  onRequestWithdrawal: (id: string) => void;
  onWithdrawalReview: (id: string, action: "approve" | "reject") => void;
  onRelease: (id: string) => void;
  onCancel: (id: string) => void;
}

function statusClass(proposal: Proposal) {
  if (proposal.status === "Rejected" || proposal.status === "Cancelled" || proposal.status === "Release Rejected") return "bg-red-100 text-red-700";
  if (["Approved", "Funding", "Validated", "Validator Release Approved", "Release Approved"].includes(proposal.status)) return "bg-green-100 text-green-700";
  if (proposal.status === "Released") return "bg-black text-white";
  return "bg-yellow-100 text-yellow-700";
}

export default function ProposalBoard({
  proposals, currentRole, currentUserId, group, orgId, groupId, onCreate, onDelete, onValidate, onAdminReview,
  onRegisterOnChain, onActivateFunding, onRequestWithdrawal, onWithdrawalReview, onRelease, onCancel,
}: Props) {
  const [open, setOpen] = useState(false);
  const { address, connectWallet, connecting } = useWallet();
  const { profile } = useProfile();
  const list = Array.isArray(proposals) ? proposals : [];
  const isAdmin = currentRole === "Admin";
  const isValidator = currentRole === "Validator";

  async function openCreate() {
    if (!address) {
      const connected = await connectWallet();
      if (!connected) return;
    }
    setOpen(true);
  }

  return (
    <>
      {open && <CreateProposalModal open={open} onClose={() => setOpen(false)} onCreate={onCreate} recipientWallet={address} />}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div><h2 className="text-xl font-bold">Proposal Board</h2><p className="text-sm text-gray-500">Validator review → admin approval → on-chain funding → withdrawal.</p></div>
        <button onClick={() => void openCreate()} disabled={connecting} className="bg-primary text-white px-4 py-2 rounded-none flex items-center gap-2 hover:bg-primary-hover disabled:bg-gray-400 border-2 border-foreground shadow-brutal"><Plus size={18} />{connecting ? "Connecting…" : "New Proposal"}</button>
      </div>

      {list.length === 0 ? <div className="bg-white border p-8 text-center text-gray-500 shadow-brutal">No proposal yet.</div> : (
        <div className="space-y-4">
          {list.map((proposal) => {
            const percentage = fundingPercentage(proposal.fundedAmountAtomic || "0", proposal.targetAmountAtomic || "0");
            const isCreator = Boolean(currentUserId && proposal.creatorId && String(proposal.creatorId) === String(currentUserId)) || Boolean(profile?._id && proposal.creatorId && String(proposal.creatorId) === String(profile._id));
            const canCancel = (isCreator || isAdmin) && !["RELEASED", "CANCELLED"].includes(proposal.blockchainStatus || "") && proposal.status !== "Released" && proposal.status !== "Cancelled";
            const isFunding = ["Funding", "Release Rejected"].includes(proposal.status) && proposal.blockchainStatus === "APPROVED";
            const finished = BigInt(proposal.fundedAmountAtomic || "0") >= BigInt(proposal.targetAmountAtomic || "0") || new Date(proposal.deadline).getTime() <= Date.now();
            return (
              <div key={proposal._id} className="bg-white border p-5 shadow-brutal">
                <div className="flex flex-wrap gap-3 justify-between items-start">
                  <div className="min-w-0"><h3 className="font-bold text-lg">{proposal.title}</h3><p className="text-sm text-gray-500 mt-1">By {proposal.creator}</p><p className="text-xs text-gray-500 mt-1 break-all">Fundraiser: {proposal.recipientWallet}</p></div>
                  <span className={`text-xs px-3 py-1 rounded-full ${statusClass(proposal)}`}>{proposal.status}</span>
                </div>

                <div className="mt-5"><div className="flex justify-between text-sm mb-2"><span>{formatBotAmount(proposal.fundedAmountAtomic || "0")} / {formatBotAmount(proposal.targetAmountAtomic || "0")} BOT</span><span>{percentage}%</span></div><div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-primary transition-all" style={{ width: `${percentage}%` }} /></div></div>

                <p className="mt-3 text-xs text-gray-500">Blockchain: {proposal.blockchainStatus || "PENDING"} · Deadline: {new Date(proposal.deadline).toLocaleDateString()}</p>
                <div className="mt-5 flex gap-2 flex-wrap">
                  <Link href={`/organization/${orgId}/groups/${groupId}/proposal/${proposal._id}`} className="bg-primary text-white px-4 py-2 border-2 border-foreground shadow-brutal">View Detail</Link>

                  {proposal.status === "Pending" && isValidator && <><button onClick={() => onValidate(proposal._id, "approve")} className="bg-green-600 text-white px-4 py-2">Validate</button><button onClick={() => onValidate(proposal._id, "reject")} className="bg-red-600 text-white px-4 py-2">Reject</button></>}
                  {proposal.status === "Validated" && isAdmin && <><button onClick={() => onAdminReview(proposal._id, "approve")} className="bg-green-600 text-white px-4 py-2">Approve Proposal</button><button onClick={() => onAdminReview(proposal._id, "reject")} className="bg-red-600 text-white px-4 py-2">Reject</button></>}
                  {proposal.status === "Approved" && proposal.blockchainStatus === "PENDING" && isAdmin && <button onClick={() => onRegisterOnChain(proposal._id)} className="bg-primary text-white px-4 py-2">Register On-chain</button>}
                  {proposal.status === "Approved" && proposal.blockchainStatus === "CREATED" && isAdmin && <button onClick={() => onActivateFunding(proposal._id)} className="bg-purple-600 text-white px-4 py-2">Activate Funding</button>}
                  {isFunding && !finished && <Link href={`/organization/${orgId}/groups/${groupId}/proposal/${proposal._id}`} className="bg-black text-white px-4 py-2">Contribute BOT</Link>}
                  {isFunding && finished && isCreator && <button onClick={() => onRequestWithdrawal(proposal._id)} className="bg-primary text-white px-4 py-2">{proposal.status === "Release Rejected" ? "Request Again" : "Request Withdrawal"}</button>}
                  {proposal.status === "Withdrawal Requested" && isValidator && <><button onClick={() => onWithdrawalReview(proposal._id, "approve")} className="bg-green-600 text-white px-4 py-2">Approve Release</button><button onClick={() => onWithdrawalReview(proposal._id, "reject")} className="bg-red-600 text-white px-4 py-2">Reject Release</button></>}
                  {proposal.status === "Validator Release Approved" && isAdmin && <><button onClick={() => onWithdrawalReview(proposal._id, "approve")} className="bg-green-600 text-white px-4 py-2">Final Approve Release</button><button onClick={() => onWithdrawalReview(proposal._id, "reject")} className="bg-red-600 text-white px-4 py-2">Reject Release</button></>}
                  {proposal.status === "Release Approved" && isAdmin && <button onClick={() => onRelease(proposal._id)} className="bg-black text-white px-4 py-2">Release BOT</button>}
                  {proposal.status === "Pending" && isCreator && proposal.blockchainStatus === "PENDING" && <button onClick={() => { if (window.confirm("Delete this pending proposal?")) onDelete(proposal._id); }} className="bg-red-600 text-white px-4 py-2">Delete Proposal</button>}
                  {canCancel && (["Validated", "Approved", "Funding", "Release Rejected"].includes(proposal.status)) && <button onClick={() => { if (window.confirm("Cancel this proposal? Donors will be able to claim BOT refunds if funds were collected.")) onCancel(proposal._id); }} className="border-2 border-red-600 text-red-700 px-4 py-2">Cancel Proposal</button>}
>>>>>>> master
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
