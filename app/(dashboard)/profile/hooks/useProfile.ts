"use client";

import { useEffect, useState } from "react";
import type { Profile } from "../page";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem("user");

    if (cached) {
      try {
        const user = JSON.parse(cached);
        setProfile({
          _id: user.id,
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
      if (!token) return;

      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

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
    } finally {
      setLoading(false);
    }
  }

  return { profile, loading, refresh: fetchProfile };
}