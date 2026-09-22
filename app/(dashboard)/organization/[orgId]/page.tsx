"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import {
  Wallet,
  Users,
  FolderKanban,
  Plus,
  Copy,
  Check,
  MoreVertical,
  LogOut,
  Trash2,
} from "lucide-react";

import CreateGroupModal from "@/components/group/CreateGroupModal";

interface Organization {
  _id: string;
  name: string;
  slug: string;
  description: string;
  treasury: number;
  members: number;
  code: string;
}

interface Group {
  _id: string;
  name: string;
  description: string;
  leader: string;
  members: number;
}

interface Member {
  _id: string;
  name: string;
  walletAddress: string;
  role: "Admin" | "Member" | "Validator";
}

export default function OrganizationPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  const { address } = useWallet();

  const [org, setOrg] = useState<Organization | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const [loading, setLoading] = useState(true);
  const [groupOpen, setGroupOpen] = useState(false);

  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [myRole, setMyRole] = useState<"Admin" | "Member" | "Validator">("Member");

  useEffect(() => {
    if (orgId) fetchData();
  }, [orgId]);

  async function fetchData() {
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const [orgRes, groupRes, memberRes] =
        await Promise.all([
          fetch(`/api/organizations/${orgId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`/api/groups?organization=${orgId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(
            `/api/memberships?organization=${orgId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

      const orgData = await orgRes.json();
      const groupData = await groupRes.json();
      const memberData = await memberRes.json();

      setOrg(orgData);
      setGroups(Array.isArray(groupData) ? groupData : []);
      const list = Array.isArray(memberData) ? memberData : [];
      setMembers(list);
      const profileRes = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profile = await profileRes.json();
      const me = list.find((m: Member) => m.name === profile.name);
      if (me) setMyRole(me.role);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function copyCode() {
    if (!org) return;

    await navigator.clipboard.writeText(org.code);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  }

  async function createGroup(group: {
    name: string;
    description: string;
  }) {
    const token = localStorage.getItem("token");

    await fetch("/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: group.name,
        description: group.description,
        organizationSlug: orgId,
      }),
    });

    setGroupOpen(false);
    fetchData();
  }

  async function setValidator(id: string) {
    const token = localStorage.getItem("token");

    await fetch(`/api/memberships/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        role: "Validator",
      }),
    });

    fetchData();
  }

  async function removeMember(id: string) {
    const ok = confirm("Remove this member?");

    if (!ok) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`/api/memberships/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    alert(data.message);

    if (res.ok) {
      fetchData();
    }
  }

  async function exitOrganization() {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/organizations/exit", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ organizationId: org?._id }),
    });
    const data = await res.json();
    alert(data.message);
    if (res.ok) window.location.href = "/dashboard";
  }

  async function deleteOrganization() {
    if (!confirm(`Delete "${org?.name}" permanently?`)) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/organizations/${org?._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    alert(data.message);
    if (res.ok) window.location.href = "/dashboard";
  }

  if (loading || !org) {
    return (
      <div className="flex justify-center mt-20">
        Loading...
      </div>
    );
  }

  return (
    <>
      <CreateGroupModal
        open={groupOpen}
        onClose={() => setGroupOpen(false)}
        onCreate={createGroup}
      />

      <div className="space-y-6">
        {/* ================= HERO ================= */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white overflow-visible">
          {/* Three Dot */}
          <div className="absolute top-5 right-5">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-full bg-white/15 border border-white/20 hover:bg-white/25 flex items-center justify-center transition"
            >
              <MoreVertical size={18} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
                {/* Copy Invite */}
                <button
                  onClick={() => {
                    copyCode();
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50"
                >
                  {copied ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <Copy size={18} className="text-blue-600" />
                  )}

                  <div className="text-left">
                    <p className="text-xs text-gray-500">
                      Invitation Code
                    </p>
                    <p className="font-semibold text-gray-900">
                      {org.code}
                    </p>
                  </div>
                </button>

                <div className="border-t" />

                {/* Exit */}
                <button
                  onClick={exitOrganization}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-orange-50 text-gray-800"
                >
                  <LogOut size={18} className="text-orange-600" />
                  Exit Organization
                </button>

                <div className="border-t" />

                {/* Delete */}
                <button
                  onClick={deleteOrganization}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 text-red-600"
                >
                  <Trash2 size={18} />
                  Delete Organization
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="pr-14">
            <h1 className="text-3xl font-bold">
              {org.name}
            </h1>

            <p className="text-blue-100 mt-2">
              {org.description}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div>
              <div className="flex items-center gap-2 text-blue-100">
                <Wallet size={18} />
                <span className="text-sm">Treasury</span>
              </div>

              <h2 className="text-2xl font-bold mt-2">
                {org.treasury} BOT
              </h2>
            </div>

            <div>
              <div className="flex items-center gap-2 text-blue-100">
                <Users size={18} />
                <span className="text-sm">Members</span>
              </div>

              <h2 className="text-2xl font-bold mt-2">
                {org.members}
              </h2>
            </div>

            <div>
              <div className="flex items-center gap-2 text-blue-100">
                <FolderKanban size={18} />
                <span className="text-sm">Groups</span>
              </div>

              <h2 className="text-2xl font-bold mt-2">
                {groups.length}
              </h2>
            </div>
          </div>
        </div>

        {/* ================= MEMBERS ================= */}
        <div className="bg-white rounded-2xl border p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold">
              Organization Members
            </h2>

            <p className="text-gray-500">
              Validators are appointed by the
              leader after the offline meeting.
            </p>
          </div>

          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member._id}
                className="border rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users
                      className="text-blue-600"
                      size={20}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {member.name}
                    </h3>

                    <p className="text-xs text-gray-500 font-mono">
                      {member.walletAddress ||
                        "Wallet not connected"}
                    </p>
                  </div>
                </div>

                {member.role === "Admin" ? (
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
                    Leader
                  </span>
                ) : member.role === "Validator" ? (
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                      Validator
                    </span>

                    {myRole === "Admin" && (
                      <button
                        onClick={() => removeMember(member._id)}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {myRole === "Admin" ? (
                      <>
                        <button
                          onClick={() => setValidator(member._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition"
                        >
                          Set Validator
                        </button>

                        <button
                          onClick={() => removeMember(member._id)}
                          className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                        Member
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}

            {members.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No members found.
              </div>
            )}
          </div>
        </div>

        {/* ================= GROUP HEADER ================= */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">
              Organization Groups
            </h2>

            <p className="text-gray-500">
              Manage proposal groups
            </p>
          </div>

          {myRole === "Admin" && (
            <button
              onClick={() => setGroupOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <Plus size={18} />
              Create Group
            </button>
          )}
        </div>

        {/* ================= GROUP LIST ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {groups.map((group) => (
            <Link
              key={group._id}
              href={`/organization/${org.slug}/groups/${group._id}`}
            >
              <div className="bg-white border rounded-xl p-5 hover:shadow-lg transition">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold text-lg">
                      {group.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Leader: {group.leader}
                    </p>
                  </div>

                  <Users className="text-blue-600" />
                </div>

                <div className="mt-6 pt-4 border-t flex justify-between text-sm">
                  <span className="text-gray-500">
                    Members
                  </span>

                  <span className="font-semibold">
                    {group.members}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}