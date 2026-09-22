"use client";

import { useEffect, useState } from "react";

import ProfileHero from "@/components/profile/ProfileHero";
import ProfileInfo from "@/components/profile/ProfileInfo";

export interface Profile {
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
    const cached = localStorage.getItem("user");

    if (cached) {
      try {
        const user = JSON.parse(cached);

        setProfile({
          _id: user.id || "",
          name: user.name,
          email: user.email,
          role: user.role,
          walletAddress: user.walletAddress || "",
        });
      } catch {}
    }

    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      setProfile(data);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          walletAddress: data.walletAddress,
        })
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !profile) {
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
      <ProfileHero profile={profile} />
      <ProfileInfo profile={profile} />
    </div>
  );
}