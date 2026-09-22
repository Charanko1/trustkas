"use client";

import {
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface Props {
  proposal: {
    status: "Pending" | "Approved" | "Rejected";
    approvedBy: string;
    approvedAt?: string;
  };
}

export default function ValidatorCard({ proposal }: Props) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-xl font-bold mb-5">
        Validator Decision
      </h2>

      {proposal.status === "Pending" && (
        <div className="flex items-center gap-3 text-yellow-600">
          <Clock size={24} />
          <div>
            <h3 className="font-semibold">Waiting Validation</h3>
            <p className="text-sm text-gray-500">
              Proposal is currently under review.
            </p>
          </div>
        </div>
      )}

      {proposal.status === "Approved" && (
        <div className="flex items-center gap-3 text-green-600">
          <CheckCircle size={24} />
          <div>
            <h3 className="font-semibold">Proposal Approved</h3>
            <p className="text-sm">
              Approved by {proposal.approvedBy}
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
            <h3 className="font-semibold">Proposal Rejected</h3>
            <p className="text-sm">
              Rejected by {proposal.approvedBy}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}