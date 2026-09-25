"use client";

<<<<<<< HEAD
import { useEffect, useState } from "react";
import { formatEther } from "ethers";
import { getContract } from "@/lib/blockchain";

export default function TreasuryBalance() {
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    loadBalance();
  }, []);

  async function loadBalance() {
    const contract = await getContract();

    const value = await contract.getBalance();

    setBalance(formatEther(value));
  }

  return (
    <div className="bg-white rounded-xl border p-6">
      <p className="text-gray-500">
        Organization Treasury
      </p>

      <h1 className="text-3xl font-bold mt-2">
        {balance} BOT
      </h1>
    </div>
  );
}
=======
import { useQuery } from "@tanstack/react-query";
import { formatEther } from "ethers";
import { getTreasuryBalance } from "@/lib/blockchain";
import { useBlockchainRealtime } from "@/context/BlockchainRealtimeContext";

export default function TreasuryBalance() {
  const { status, lastEventAt } = useBlockchainRealtime();
  const query = useQuery({
    queryKey: ["treasury-balance"],
    queryFn: async () => formatEther(await getTreasuryBalance()),
  });

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-gray-500">Organization Treasury</p>
        <span
          className="text-xs font-semibold uppercase tracking-wide"
          title={lastEventAt ? `Last blockchain event at ${new Date(lastEventAt).toLocaleString()}` : undefined}
        >
          {status === "connected" ? "LIVE" : status === "connecting" ? "SYNCING" : "OFFLINE"}
        </span>
      </div>

      <h1 className="text-3xl font-bold mt-2">
        {query.isPending ? "…" : query.data ?? "0"} BOT
      </h1>

      {query.error && (
        <p className="text-xs text-red-600 mt-2">Could not read the on-chain treasury balance.</p>
      )}
    </div>
  );
}
>>>>>>> master
