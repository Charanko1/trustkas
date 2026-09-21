"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  History,
  UserCircle,
} from "lucide-react";

const menus = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "History",
    href: "/history",
    icon: History,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: UserCircle,
  },
];

interface UserData {
  name: string;
  walletAddress: string;
}

export default function MainSidebar() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  }

  const shortWallet = user?.walletAddress
    ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
    : "Not Connected";

  return (
    <aside className="w-64 h-screen bg-black text-white p-6 flex flex-col">
      {/* Logo */}
      <div>
        <h1 className="text-3xl font-bold text-blue-500">
          TrustKas
        </h1>

        <p className="text-zinc-400 text-sm mt-1">
          Platform
        </p>
      </div>

      {/* Menu */}
      <nav className="mt-10 space-y-2">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <Link
              key={menu.title}
              href={menu.href}
              className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-zinc-900 transition"
            >
              <Icon size={20} />
              {menu.title}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="mt-auto border-t border-zinc-800 pt-4 flex items-center gap-3">
        <UserCircle size={38} />

        <div className="min-w-0">
          <p className="font-semibold truncate">
            {user?.name || "Loading..."}
          </p>

          <span className="text-xs text-zinc-400 truncate block">
            {shortWallet}
          </span>
        </div>
      </div>
    </aside>
  );
}