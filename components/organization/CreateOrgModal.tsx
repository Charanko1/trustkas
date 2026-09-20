"use client";

import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateOrgModal({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleCreate = async () => {
    if (!name.trim()) return;

    setLoading(true);

    try {
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          description,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create organization");
      }

      // Reset form
      setName("");
      setDescription("");

      onClose();

      // Refresh dashboard
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[500px] p-6 space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Create Organization</h2>

          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <div>
          <label className="text-sm font-medium">
            Organization Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-2 border rounded-lg p-3 outline-none focus:border-blue-600"
            placeholder="HIMA Informatika"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-2 border rounded-lg p-3 h-28 outline-none focus:border-blue-600"
            placeholder="Student organization..."
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Organization"}
        </button>
      </div>
    </div>
  );
}