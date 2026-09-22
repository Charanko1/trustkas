"use client";

import ProfileHero from "@/components/profile/ProfileHero";
import ProfileInfo from "@/components/profile/ProfileInfo";
import { useProfile } from "./hooks/useProfile";

export interface Profile {
  _id: string;
  name: string;
  email: string;
  role: string;
  walletAddress: string;
}

export default function ProfilePage() {
  const { profile, loading } = useProfile();

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