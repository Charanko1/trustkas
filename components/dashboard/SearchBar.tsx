"use client";

import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
      <Search className="text-gray-400" size={20} />

      <input
        placeholder="Search organization..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 outline-none"
      />
    </div>
  );
}