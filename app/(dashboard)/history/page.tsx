import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const transactions = [
  {
    id: 1,
    title: "AI Workshop 2026",
    organization: "HIMA Informatika",
    amount: 20,
    type: "donation",
    status: "Success",
    hash: "0xA91F...72D",
    date: "19 Sept 2026",
  },
  {
    id: 2,
    title: "Cloud Seminar",
    organization: "UKM AI",
    amount: 50,
    type: "donation",
    status: "Success",
    hash: "0xB12C...88F",
    date: "17 Sept 2026",
  },
  {
    id: 3,
    title: "Refund Event",
    organization: "HIMA Informatika",
    amount: 10,
    type: "refund",
    status: "Completed",
    hash: "0xC77A...1BD",
    date: "14 Sept 2026",
  },
];

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <p className="text-gray-500">
          Your blockchain donation history.
        </p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="p-5 border-b last:border-none flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-full ${
                  tx.type === "donation"
                    ? "bg-green-100"
                    : "bg-blue-100"
                }`}
              >
                {tx.type === "donation" ? (
                  <ArrowUpRight className="text-green-600" />
                ) : (
                  <ArrowDownRight className="text-blue-600" />
                )}
              </div>

              <div>
                <h3 className="font-semibold">{tx.title}</h3>
                <p className="text-sm text-gray-500">
                  {tx.organization}
                </p>
                <p className="text-xs text-gray-400">
                  {tx.hash}
                </p>
              </div>
            </div>

            <div className="text-right">
              <h3 className="font-bold">{tx.amount} POL</h3>
              <p className="text-sm text-green-600">{tx.status}</p>
              <p className="text-xs text-gray-400">{tx.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}