"use client";

import Link from "next/link";
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

export default function MainSidebar() {
  return (
    <aside className="w-64 h-screen bg-black text-white p-6 flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-blue-500">
          TrustKas
        </h1>

        <p className="text-zinc-400 text-sm mt-1">
 Platform
        </p>
      </div>

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

      <div className="mt-auto border-t border-zinc-800 pt-4 flex items-center gap-3">
        <UserCircle size={38} />

        <div>
          <p className="font-semibold">Ridwan</p>

          <span className="text-xs text-zinc-400">
            0xA91...72D
          </span>
        </div>
      </div>
    </aside>
  );
}