"use client";

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