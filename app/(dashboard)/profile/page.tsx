"use client";

import { useEffect, useState } from "react";
import { Mail, Shield, Wallet, User } from "lucide-react";

interface Profile {
  _id: string;
  name: string;
  email: string;
  role: string;
  walletAddress: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center mt-20">
        User not found
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              {profile.name}
            </h1>

            <p className="text-blue-100 mt-1">
              {profile.email}
            </p>

            <span className="inline-block mt-3 bg-white/20 px-3 py-1 rounded-full text-sm capitalize">
              {profile.role}
            </span>
          </div>
        </div>
      </div>

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

            <p className="font-semibold">{profile.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Mail className="text-blue-600" />

          <div>
            <p className="text-sm text-gray-500">Email</p>

            <p className="font-semibold">{profile.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Shield className="text-blue-600" />

          <div>
            <p className="text-sm text-gray-500">Role</p>

            <p className="font-semibold capitalize">
              {profile.role}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Wallet className="text-blue-600" />

          <div>
            <p className="text-sm text-gray-500">
              Wallet Address
            </p>

            <p className="font-mono text-sm break-all">
              {profile.walletAddress || "Not Connected"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}