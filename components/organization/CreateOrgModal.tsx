"use client";

import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateOrgModal({
  open,
  onClose,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleCreate() {
    if (!name.trim()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const slug = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

      // ✅ API plural
      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          slug,
          description,
          ownerName: user.name,
          walletAddress: user.walletAddress || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setName("");
      setDescription("");
      onClose();

      // refresh dashboard
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to create organization");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Create Organization
          </h2>

          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-black"
          >
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
            placeholder="HIMA Informatika"
            className="mt-2 w-full rounded-xl border p-3 outline-none focus:border-blue-600"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Student organization..."
            className="mt-2 h-28 w-full resize-none rounded-xl border p-3 outline-none focus:border-blue-600"
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Creating..."
            : "Create Organization"}
        </button>
      </div>
    </div>
  );
}