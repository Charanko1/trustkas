"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  const fetchOrganizations = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await fetch("/api/organizations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch organizations");
      }

      const data = await res.json();
      setOrganizations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Organization Error:", err);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Fetch hanya sekali saat halaman dibuka
  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <CreateOrgModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          fetchOrganizations();
        }}
      />

      <JoinOrgModal
        open={joinOpen}
        onClose={() => {
          setJoinOpen(false);
          fetchOrganizations();
        }}
      />

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">My Organizations</h1>
          <p className="text-gray-500">
            Create or join your organization workspace.
          </p>
        </div>

        <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
          <Search className="text-gray-400" size={20} />
          <input
            placeholder="Search organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-6 text-left transition"
          >
            <Plus size={30} />
            <h2 className="text-xl font-bold mt-4">
              Create Organization
            </h2>
            <p className="text-blue-100 mt-1">
              Build your own workspace
            </p>
          </button>

          <button
            onClick={() => setJoinOpen(true)}
            className="bg-white border hover:border-blue-500 rounded-xl p-6 text-left transition"
          >
            <Users size={30} className="text-blue-600" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white border rounded-xl p-5 animate-pulse"
                >
                  <div className="h-5 w-40 bg-gray-200 rounded mb-3" />
                  <div className="h-3 w-24 bg-gray-200 rounded mb-6" />
                  <div className="h-3 w-full bg-gray-100 rounded mb-2" />
                  <div className="h-3 w-2/3 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : filteredOrganizations.length === 0 ? (
            <div className="bg-white border rounded-xl p-10 text-center">
              <Users size={42} className="mx-auto text-gray-300" />
              <h3 className="mt-4 text-lg font-semibold">
                No Organizations
              </h3>
              <p className="text-gray-500 mt-2">
                Create your first organization or join one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOrganizations.map((org) => (
                <Link
                  key={org._id}
                  href={`/organization/${org.slug}`}
                >
                  <div className="bg-white border rounded-xl p-5 hover:shadow-lg transition">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold text-lg">
                          {org.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {org.members} Members
                        </p>
                      </div>

                      <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                        Admin
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mt-4 line-clamp-2">
                      {org.description}
                    </p>

                    <div className="mt-5 pt-4 border-t flex justify-between">
                      <span>Treasury</span>
                      <span className="font-bold text-green-600">
                        {org.treasury} ETH
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