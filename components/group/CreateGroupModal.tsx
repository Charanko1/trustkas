"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (group: {
    name: string;
    description: string;
  }) => void;
}

export default function CreateGroupModal({
  open,
  onClose,
  onCreate,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null;

  const handleCreate = () => {
    if (!name.trim()) return;

    onCreate({
      name,
      description,
    });

    setName("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[500px] p-6 space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Create Group
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div>
          <label className="text-sm font-medium">
            Group Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Event Division"
            className="w-full mt-2 border rounded-lg p-3 outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Manage all event proposals"
            className="w-full mt-2 border rounded-lg p-3 h-28 outline-none focus:border-blue-600"
          />
        </div>

        <button
          onClick={handleCreate}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Create Group
        </button>
      </div>
    </div>
  );
}