"use client";

import { Plus, Users } from "lucide-react";

interface Props {
  onCreate: () => void;
  onJoin: () => void;
}

export default function ActionCards({
  onCreate,
  onJoin,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <button
        onClick={onCreate}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-6 text-left transition"
      >
        <Plus size={30} />

        <h2 className="text-xl font-bold mt-4">
          Create Organization
        </h2>

        <p className="text-blue-100 mt-1">
          Build your own workspace
        </p>
      </button>

      <button
        onClick={onJoin}
        className="bg-white border hover:border-blue-500 rounded-xl p-6 text-left transition"
      >
        <Users size={30} className="text-blue-600" />

        <h2 className="text-xl font-bold mt-4">
          Join Organization
        </h2>

        <p className="text-gray-500 mt-1">
          Enter invitation code
        </p>
      </button>
    </div>
  );
}