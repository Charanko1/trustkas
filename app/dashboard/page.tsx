"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Users } from "lucide-react";

import CreateOrgModal from "@/components/organization/CreateOrgModal";
import JoinOrgModal from "@/components/organization/JoinOrgModal";

interface Organization {
  _id: string;
  name: string;
  slug: string;
  description: string;
  treasury: number;
  members: number;
  owner: string;
}

export default function Dashboard() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  async function fetchOrganizations() {
    try {
      const res = await fetch("/api/organizations");
      const data = await res.json();

      setOrganizations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <CreateOrgModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <JoinOrgModal
        open={joinOpen}
        onClose={() => setJoinOpen(false)}
      />

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">My Organizations</h1>
          <p className="text-gray-500">
            Join or create an organization workspace.
          </p>
        </div>

        <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
          <Search className="text-gray-400" />
          <input
            placeholder="Search organization..."
            className="flex-1 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => setCreateOpen(true)}
            className="bg-blue-600 text-white rounded-xl p-6 text-left"
          >
            <Plus size={28} />
            <h2 className="text-xl font-bold mt-4">
              Create Organization
            </h2>
            <p className="text-blue-100 mt-1">
              Build your own workspace
            </p>
          </button>

          <button
            onClick={() => setJoinOpen(true)}
            className="bg-white border rounded-xl p-6 text-left"
          >
            <Users size={28} className="text-blue-600" />
            <h2 className="text-xl font-bold mt-4">
              Join Organization
            </h2>
            <p className="text-gray-500 mt-1">
              Enter invitation code
            </p>
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Your Organizations
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {organizations.map((org) => (
                <Link
                  key={org._id}
                  href={`/organization/${org.slug}`}
                >
                  <div className="bg-white border rounded-xl p-5 hover:shadow-md transition">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold text-lg">
                          {org.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {org.members} Members
                        </p>
                      </div>

                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full h-fit">
                        Owner
                      </span>
                    </div>

                    <div className="mt-5 pt-4 border-t flex justify-between">
                      <span className="text-gray-500">
                        Treasury
                      </span>

                      <span className="font-semibold">
                        {org.treasury} POL
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}