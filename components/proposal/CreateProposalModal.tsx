"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Proposal {
  title: string;
  description: string;
  target: number;
  deadline: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (proposal: Proposal) => void;
}

export default function CreateProposalModal({
  open,
  onClose,
  onCreate,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!title || !target) return;

    onCreate({
      title,
      description,
      target: Number(target),
      deadline,
    });

    setTitle("");
    setDescription("");
    setTarget("");
    setDeadline("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-[560px] rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">New Proposal</h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div>
          <label className="text-sm font-medium">
            Proposal Title
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg p-3 mt-2"
            placeholder="AI Workshop 2026"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg p-3 mt-2 h-28"
            placeholder="Describe your event..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">
              Target (POL)
            </label>

            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full border rounded-lg p-3 mt-2"
              placeholder="300"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Deadline
            </label>

            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Submit Proposal
        </button>
      </div>
    </div>
  );
}