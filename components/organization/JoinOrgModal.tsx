"use client";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function JoinOrgModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[420px] p-6 space-y-4">

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Join Organization</h2>

          <button onClick={onClose}>✕</button>
        </div>

        <div>
          <label className="text-sm font-medium">
            Invitation Code
          </label>

          <input
            className="w-full mt-1 border rounded-lg p-3 uppercase"
            placeholder="HIMA-7X92KD"
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
          Join Now
        </button>

      </div>
    </div>
  );
}