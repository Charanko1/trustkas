"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Wallet,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import {
  getContract,
  getWalletAddress,
} from "@/lib/blockchain";
import { parseEther } from "ethers";

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
  deadline: string;
}

export default function ProposalDetailPage() {
  const params = useParams();
  const proposalId = params.proposalId as string;

  const [proposal, setProposal] =
    useState<Proposal | null>(null);

  const [loading, setLoading] = useState(true);
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    fetchProposal();
  }, []);

  async function fetchProposal() {
    try {
      const res = await fetch(
        `/api/proposals/${proposalId}`
      );

      const data = await res.json();
      setProposal(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function donate() {
    if (!proposal) return;

    try {
      setDonating(true);

      const contract = await getContract();
      const donor = await getWalletAddress();

      const tx = await contract.donate(
        proposal._id,
        {
          value: parseEther("0.001"), // 0.001 ETH Sepolia
        }
      );

      await tx.wait();

      await fetch(
        `/api/proposals/${proposal._id}/donate`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: 0.001,
            donor,
            txHash: tx.hash,
          }),
        }
      );

      alert("Donation Success!");
      fetchProposal();
    } catch (err) {
      console.error(err);
      alert("Transaction Failed");
    } finally {
      setDonating(false);
    }
  }

  if (loading || !proposal) {
    return (
      <div className="flex justify-center mt-20">
        Loading...
      </div>
    );
  }

  const percentage = Math.round(
    (proposal.fundedAmount /
      proposal.targetAmount) *
      100
  );

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold">
          {proposal.title}
        </h1>

        <p className="text-blue-100 mt-2">
          Organization Fundraising Proposal
        </p>

        <div className="grid grid-cols-3 gap-6 mt-8">
          <div>
            <div className="flex items-center gap-2">
              <User size={18} />
              <span className="text-sm">
                Creator
              </span>
            </div>

            <h3 className="font-semibold mt-2">
              {proposal.creator}
            </h3>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span className="text-sm">
                Deadline
              </span>
            </div>

            <h3 className="font-semibold mt-2">
              {new Date(
                proposal.deadline
              ).toLocaleDateString()}
            </h3>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Wallet size={18} />
              <span className="text-sm">
                Status
              </span>
            </div>

            <span className="inline-block mt-2 bg-white/20 px-3 py-1 rounded-full text-sm">
              {proposal.status}
            </span>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-bold mb-4">
          Proposal Description
        </h2>

        <p className="text-gray-700 leading-7 whitespace-pre-line">
          {proposal.description}
        </p>
      </div>

      {/* FUNDING */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">
            Funding Progress
          </h2>

          <Wallet className="text-blue-600" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Target Amount
            </p>

            <h2 className="text-2xl font-bold">
              {proposal.targetAmount} ETH
            </h2>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">
              Collected
            </p>

            <h2 className="text-2xl font-bold text-green-600">
              {proposal.fundedAmount} ETH
            </h2>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{percentage}%</span>
          </div>

          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* VALIDATOR */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-bold mb-5">
          Validator Decision
        </h2>

        {proposal.status === "Pending" && (
          <div className="flex items-center gap-3 text-yellow-600">
            <Clock size={24} />

            <div>
              <h3 className="font-semibold">
                Waiting Validation
              </h3>

              <p className="text-sm text-gray-500">
                Proposal is currently under
                review.
              </p>
            </div>
          </div>
        )}

        {proposal.status === "Approved" && (
          <div className="flex items-center gap-3 text-green-600">
            <CheckCircle size={24} />

            <div>
              <h3 className="font-semibold">
                Proposal Approved
              </h3>

              <p className="text-sm">
                Approved by{" "}
                {proposal.approvedBy}
              </p>

              {proposal.approvedAt && (
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(
                    proposal.approvedAt
                  ).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        {proposal.status === "Rejected" && (
          <div className="flex items-center gap-3 text-red-600">
            <XCircle size={24} />

            <div>
              <h3 className="font-semibold">
                Proposal Rejected
              </h3>

              <p className="text-sm">
                Rejected by{" "}
                {proposal.approvedBy}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* DONATE */}
      {proposal.status === "Approved" && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-xl font-bold mb-2">
            Donate to Treasury
          </h2>

          <p className="text-gray-500 mb-1">
            Support this proposal using ETH
            from your MetaMask wallet.
          </p>

          <p className="text-sm text-blue-600 mb-6">
            Donation Amount: 0.001 ETH
            (Sepolia)
          </p>

          <button
            onClick={donate}
            disabled={donating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold transition"
          >
            {donating
              ? "Waiting Confirmation..."
              : "Donate 0.001 ETH"}
          </button>
        </div>
      )}
    </div>
  );
}