"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    fetchOrganizations();
  }, []);

  async function fetchOrganizations() {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/organizations", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setOrganizations([]);
        return;
      }

      const data = await res.json();
      setOrganizations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  }

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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Organizations</h1>
          <p className="text-gray-500">
            Create or join your organization workspace.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
          <Search className="text-gray-400" size={20} />

          <input
            placeholder="Search organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none"
          />
        </div>

        {/* Action */}
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

        {/* Organizations */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Your Organizations
          </h2>

          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading organizations...
            </div>
          ) : filteredOrganizations.length === 0 ? (
            <div className="bg-white border rounded-xl p-10 text-center">
              <Users
                size={42}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-4 text-lg font-semibold">
                No Organizations
              </h3>

              <p className="text-gray-500 mt-2">
                Create your first organization or join one using an invitation code.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOrganizations.map((org) => (
                <Link
                  key={org._id}
                  href={`/organization/${org.slug}`}
                >
                  <div className="bg-white border rounded-xl p-5 hover:shadow-lg transition cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">
                          {org.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {org.members} Members
                        </p>
                      </div>

                      <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                        Admin
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm mt-4 line-clamp-2">
                      {org.description}
                    </p>

                    <div className="mt-5 pt-4 border-t flex justify-between items-center">
                      <span className="text-gray-500">
                        Treasury
                      </span>

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