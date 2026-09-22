"use client";

import type { Profile } from "@/types/profile";

interface Props {
  profile: Profile;
}

export default function ProfileHero({ profile }: Props) {
  return (
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
  );
}