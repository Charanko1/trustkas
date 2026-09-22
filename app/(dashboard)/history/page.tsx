
"use client";

import { useEffect, useState } from "react";
import { Clock, ArrowDownLeft, ArrowUpRight, Vote, FileText } from "lucide-react";

interface Activity {
  _id: string;
  type: "DONATION" | "WITHDRAW" | "PROPOSAL" | "VOTE" | "VALIDATOR";
  title: string;
  description: string;
  amount?: number;
  txHash?: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setActivities(Array.isArray(data) ? data : []);
  }

  const icon = (type: Activity["type"]) => {
    switch (type) {
      case "DONATION":
        return <ArrowDownLeft className="text-green-600" size={20} />;
      case "WITHDRAW":
        return <ArrowUpRight className="text-red-600" size={20} />;
      case "PROPOSAL":
        return <FileText className="text-blue-600" size={20} />;
      default:
        return <Vote className="text-purple-600" size={20} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">History</h1>
        <p className="text-gray-500">
          Transparent organization activity powered by BOT Chain.
        </p>
      </div>

      <div className="bg-white rounded-2xl border p-6">
        <div className="space-y-5">
          {activities.map((item) => (
            <div key={item._id} className="flex gap-4">
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center">
                {icon(item.type)}
              </div>

              <div className="flex-1 border-b pb-4">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{item.title}</h3>

                  <span className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-500 text-sm mt-1">
                  {item.description}
                </p>

                {item.amount && (
                  <p className="text-green-600 font-semibold mt-2">
                    + {item.amount} BOT
                  </p>
                )}

                {item.txHash && (
                  <p className="font-mono text-xs mt-2 text-blue-600 break-all">
                    {item.txHash}
                  </p>
                )}
              </div>
            </div>
          ))}

          {activities.length === 0 && (
            <div className="py-10 text-center text-gray-400">
              <Clock size={40} className="mx-auto mb-3" />
              No activity yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}