"use client";

import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    vision: string;
  }) => void;
}

export default function NominateModal({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [vision, setVision] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[520px] rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-bold">
          Nominate Yourself
        </h2>

        <div>
          <label className="text-sm font-medium">
            Full Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 border rounded-lg p-3"
            placeholder="Ridwan Aziz"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Vision & Mission
          </label>

          <textarea
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            className="w-full mt-1 border rounded-lg p-3 h-32"
            placeholder="Increase transparency and accountability..."
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onSubmit({ name, vision });
              setName("");
              setVision("");
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}