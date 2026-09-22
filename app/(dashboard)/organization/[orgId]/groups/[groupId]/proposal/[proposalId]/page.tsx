"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getContract, getWalletAddress } from "@/lib/blockchain";
import { parseEther } from "ethers";

import ProposalHero from "@/components/proposal/ProposalHero";
import FundingCard from "@/components/proposal/FundingCard";
import ValidatorCard from "@/components/proposal/ValidatorCard";

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
  const { proposalId } = useParams() as { proposalId: string };

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    fetchProposal();
  }, []);

  async function fetchProposal() {
    const res = await fetch(`/api/proposals/${proposalId}`);
    setProposal(await res.json());
    setLoading(false);
  }

  async function donate() {
    if (!proposal) return;

    try {
      setDonating(true);

      const contract = await getContract();
      const donor = await getWalletAddress();

      const tx = await contract.donate(proposal._id, {
        value: parseEther("0.001"),
      });

      await tx.wait();

      await fetch(`/api/proposals/${proposal._id}/donate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 0.001,
          donor,
          txHash: tx.hash,
        }),
      });

      fetchProposal();
      alert("Donation Success!");
    } catch {
      alert("Transaction Failed");
    } finally {
      setDonating(false);
    }
  }

  if (loading || !proposal)
    return <div className="flex justify-center mt-20">Loading...</div>;

  return (
    <div className="space-y-8">
      <ProposalHero proposal={proposal} />

      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-bold mb-4">
          Proposal Description
        </h2>

        <p className="text-gray-700 leading-7 whitespace-pre-line">
          {proposal.description}
        </p>
      </div>

      <FundingCard
        target={proposal.targetAmount}
        funded={proposal.fundedAmount}
      />

      <ValidatorCard proposal={proposal} />

      {proposal.status === "Approved" && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-xl font-bold mb-2">
            Donate to Treasury
          </h2>

          <p className="text-gray-500 mb-1">
            Support this proposal using ETH from your MetaMask wallet.
          </p>

          <p className="text-sm text-blue-600 mb-6">
            Donation Amount: 0.001 ETH (Sepolia)
          </p>

          <button
            onClick={donate}
            disabled={donating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold"
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