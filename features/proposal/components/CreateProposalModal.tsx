"use client";
import Modal from "@/components/ui/Modal";

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
  onCreate: (proposal: Proposal) => Promise<void>;
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

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  if (!open) return null;

  const handleSubmit = async () => {
    if (saving || !title.trim() || !target || Number(target) <= 0) return;
    setSaving(true); setError("");
    try { await onCreate({ title, description, target: Number(target), deadline }); onClose(); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not save. Please try again."); }
    finally { setSaving(false); }
  };

  return (
    <Modal title="Create proposal" onClose={onClose}>
      <div className="bg-white w-full max-w-xl rounded-none p-6 space-y-4 border-2 border-foreground shadow-brutal">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <h2 className="text-2xl font-bold">New Proposal</h2>

          <button aria-label="Close dialog" type="button" onClick={onClose}>
            <X />
          </button>
        </div>

        <div>
          <label htmlFor="createproposalmodal-1" className="text-sm font-medium">
            Proposal Title
          </label>

          <input id="createproposalmodal-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-none p-3 mt-2 shadow-brutal"
            placeholder="AI Workshop 2026"
          />
        </div>

        <div>
          <label htmlFor="createproposalmodal-2" className="text-sm font-medium">
            Description
          </label>

          <textarea id="createproposalmodal-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-none p-3 mt-2 h-28 shadow-brutal"
            placeholder="Describe your event..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="createproposalmodal-3" className="text-sm font-medium">
              Target (BOT)
            </label>

            <input id="createproposalmodal-3"
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full border rounded-none p-3 mt-2 shadow-brutal"
              placeholder="300"
            />
          </div>

          <div>
            <label htmlFor="createproposalmodal-4" className="text-sm font-medium">
              Deadline
            </label>

            <input id="createproposalmodal-4"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border rounded-none p-3 mt-2 shadow-brutal"
            />
          </div>
        </div>

        {error && <p role="alert" className="text-red-700">{error}</p>}
        <button
          disabled={saving}
          onClick={handleSubmit}
          className="w-full bg-primary text-white py-3 rounded-none hover:bg-primary-hover border-2 border-foreground shadow-brutal"
        >
          {saving ? "Saving…" : "Submit Proposal"}
        </button>
      </div>
    </Modal>
  );
}