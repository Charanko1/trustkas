"use client";

import { Bell, Wallet } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

export default function Header() {
  const { address, connectWallet } = useWallet();

  async function handleConnect() {
    await connectWallet();

    // Refresh supaya Sidebar & Profile ikut update
    window.location.reload();
  }

  return (
    <header className="h-16 bg-white border-b px-8 flex items-center justify-between">
      <div>
        <h2 className="font-semibold text-lg">Welcome Back</h2>
        <p className="text-sm text-gray-500">
          Manage your organizations
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Bell className="text-gray-500" />

        {address ? (
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium">
            <Wallet size={18} />
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        ) : (
          <button
            onClick={handleConnect}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Wallet size={18} />
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}