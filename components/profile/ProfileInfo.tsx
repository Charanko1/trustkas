"use client";

import { Mail, Shield, Wallet, User } from "lucide-react";
import type { Profile } from "@/types/profile";

interface Props {
  profile: Profile;
}

export default function ProfileInfo({ profile }: Props) {
  return (
    <div className="bg-white rounded-2xl border p-6 space-y-5">
      <h2 className="text-xl font-bold">
        Account Information
      </h2>

      <div className="flex items-center gap-4">
        <User className="text-blue-600" />

        <div>
          <p className="text-sm text-gray-500">
            Full Name
          </p>

          <p className="font-semibold">
            {profile.name}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Mail className="text-blue-600" />

        <div>
          <p className="text-sm text-gray-500">
            Email
          </p>

          <p className="font-semibold">
            {profile.email}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Shield className="text-blue-600" />

        <div>
          <p className="text-sm text-gray-500">
            Role
          </p>

          <p className="font-semibold capitalize">
            {profile.role}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Wallet className="text-blue-600" />

        <div className="min-w-0">
          <p className="text-sm text-gray-500">
            Wallet Address
          </p>

          <p className="font-mono text-sm break-all">
            {profile.walletAddress || "Not Connected"}
          </p>
        </div>
      </div>
    </div>
  );
}