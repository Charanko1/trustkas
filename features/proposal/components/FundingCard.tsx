"use client";

import { Wallet } from "lucide-react";

interface Props {
  target: number;
  funded: number;
}

export default function FundingCard({ target, funded }: Props) {
  const percentage =
    target <= 0 ? 0 : Math.round((funded / target) * 100);

  return (
    <div className="bg-white rounded-none border p-6 shadow-brutal">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-5">
        <h2 className="text-xl font-bold">Funding Progress</h2>
        <Wallet className="text-primary" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-none p-4">
          <p className="text-sm text-gray-500">Target Amount</p>
          <h2 className="text-2xl font-bold">{target} BOT</h2>
        </div>

        <div className="bg-gray-50 rounded-none p-4">
          <p className="text-sm text-gray-500">Collected</p>
          <h2 className="text-2xl font-bold text-green-600">
            {funded} BOT
          </h2>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap gap-3 justify-between text-sm mb-2">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>

        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>
      </div>
    </div>
  );
}