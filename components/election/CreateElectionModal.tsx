"use client";

import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    title: string;
    startDate: string;
    endDate: string;
  }) => void;
}

export default function CreateElectionModal({
  open,
  onClose,
  onCreate,
}: Props) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!title || !startDate || !endDate) {
      alert("Please complete all fields.");
      return;
    }

    onCreate({
      title,
      startDate,
      endDate,
    });

    setTitle("");
    setStartDate("");
    setEndDate("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[520px] rounded-2xl p-6 space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Open Validator Election
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        <div>
          <label className="text-sm font-medium">
            Election Title
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Validator Election 2026"
            className="w-full mt-1 border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Registration Start
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full mt-1 border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Registration End
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full mt-1 border rounded-lg p-3"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
          Members will be able to nominate themselves during the registration period.
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Open Session
          </button>
        </div>
      </div>
    </div>
  );
}