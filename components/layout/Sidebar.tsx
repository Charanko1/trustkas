"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Wallet,
  FileText,
  CheckCircle,
  History,
} from "lucide-react";

const menus = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Payment", href: "/payment", icon: Wallet },
  { name: "Proposal", href: "/proposal", icon: FileText },
  { name: "Approval", href: "/approval", icon: CheckCircle },
  { name: "History", href: "/history", icon: History },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-black text-white h-screen p-6">
      <h1 className="text-2xl font-bold text-blue-500 mb-8">
        TrustKas
      </h1>

      <nav className="space-y-2">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <Link
              key={menu.name}
              href={menu.href}
              className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-zinc-900 transition"
            >
              <Icon size={20} />
              <span>{menu.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}