"use client";

import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ErrorState, LoadingState } from "@/components/ui/ContentState";
import { useParams } from "next/navigation";



import ProposalHero from "@/features/proposal/components/ProposalHero";
import FundingCard from "@/features/proposal/components/FundingCard";
import ValidatorCard from "@/features/proposal/components/ValidatorCard";

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

  const client = useQueryClient();
  const query = useQuery({ queryKey: ["proposal", proposalId], queryFn: ({ signal }) => apiClient<Proposal>(`/api/proposals/${proposalId}`, { signal }) });
  const proposal = query.data;
  const [donating, setDonating] = useState(false);
  const [donationMessage, setDonationMessage] = useState("");
  const pending = useRef(false);

  async function donate() {
    if (!proposal || pending.current) return;
    pending.current = true;
    setDonationMessage("");
    let confirmedHash = "";

    try {
      setDonating(true);

      const [{ getContract, getWalletAddress }, { parseEther }] = await Promise.all([import("@/lib/blockchain"), import("ethers")]);
      const contract = await getContract();
      const donor = await getWalletAddress();

      const tx = await contract.donate(proposal._id, {
        value: parseEther("0.001"),
      });

      await tx.wait();
      confirmedHash = tx.hash;

      await apiClient(`/api/proposals/${proposal._id}/donate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 0.001,
          donor,
          txHash: tx.hash,
        }),
      });

      await Promise.all([query.refetch(), client.invalidateQueries({ queryKey: ["group"] }), client.invalidateQueries({ queryKey: ["organizations"] }), client.invalidateQueries({ queryKey: ["organization"] }), client.invalidateQueries({ queryKey: ["history"] })]);
      setDonationMessage("Your contribution is confirmed. Thank you!");
    } catch (error) {
      setDonationMessage(confirmedHash ? `Your transaction was confirmed, but the app could not update its record. Do not send it again. Transaction: ${confirmedHash}` : error instanceof Error ? error.message : "The transaction could not be completed.");
    } finally {
      pending.current = false;
      setDonating(false);
    }
  }

  if (query.isPending) return <LoadingState label="Opening this proposal…" />;
  if (query.error || !proposal) return <ErrorState message={query.error?.message || "Proposal not found."} onRetry={() => void query.refetch()} />;

  return (
    <div className="space-y-8">
      {donationMessage && <p role="status" className="pledgr-panel p-4 break-words">{donationMessage}</p>}
      <ProposalHero proposal={proposal} />

      <div className="bg-white rounded-none border p-6 shadow-brutal">
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
        <div className="bg-white rounded-none border p-6 shadow-brutal">
          <h2 className="text-xl font-bold mb-2">
            Donate to Treasury
          </h2>

          <p className="text-gray-500 mb-1">
            Support this proposal using BOT from your MetaMask wallet.
          </p>

          <p className="text-sm text-primary mb-6">
            Donation Amount: 0.001 BOT (BOT Chain Testnet)
          </p>

          <button
            onClick={donate}
            disabled={donating}
            className="w-full bg-primary hover:bg-primary-hover disabled:bg-gray-400 text-white py-4 rounded-none font-semibold border-2 border-foreground shadow-brutal"
          >
            {donating
              ? "Waiting Confirmation..."
              : "Donate 0.001 BOT"}
          </button>
        </div>
      )}
    </div>
  );
}