"use client";

import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function JoinOrgModal({
  open,
  onClose,
}: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleJoin() {
    if (!code.trim()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/organizations/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: code.toUpperCase().trim(),
        }),
      });

      // Aman kalau backend tidak mengirim JSON
      const data = await res.json().catch(() => ({
        message: "Server error",
      }));

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to join organization"
        );
      }

      alert("Successfully joined organization!");

      setCode("");
      onClose();

      // Refresh dashboard
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      alert(
        err.message || "Failed to join organization"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Join Organization
          </h2>

          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Input */}
        <div>
          <label className="text-sm font-medium">
            Invitation Code
          </label>

          <input
            value={code}
            onChange={(e) =>
              setCode(
                e.target.value.toUpperCase()
              )
            }
            placeholder="INFO-7X92KD"
            className="mt-2 w-full rounded-xl border p-3 uppercase outline-none focus:border-blue-600"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Joining..." : "Join Now"}
        </button>
      </div>
    </div>
  );
}