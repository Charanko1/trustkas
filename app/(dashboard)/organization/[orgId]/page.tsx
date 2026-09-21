"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Wallet,
  Users,
  FolderKanban,
  Plus,
  Copy,
  Check,
} from "lucide-react";

import CreateGroupModal from "@/components/group/CreateGroupModal";
import CreateElectionModal from "@/components/election/CreateElectionModal";

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

interface Election {
  _id: string;
  title: string;
  status: "Registration" | "Voting" | "Closed";
  startDate: string;
  endDate: string;
}

export default function OrganizationPage() {
  const params = useParams();
  const orgId = params.orgId as string;

  const [org, setOrg] = useState<Organization | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);

  const [groupOpen, setGroupOpen] = useState(false);
  const [electionOpen, setElectionOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orgId) fetchData();
  }, [orgId]);

  async function fetchData() {
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const [orgRes, groupRes, electionRes] = await Promise.all([
        fetch(`/api/organizations/${orgId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/groups?organization=${orgId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/elections?organization=${orgId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const orgData = await orgRes.json();
      const groupData = await groupRes.json();
      const electionData = await electionRes.json();

      setOrg(orgData);
      setGroups(Array.isArray(groupData) ? groupData : []);
      setElections(Array.isArray(electionData) ? electionData : []);
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

  async function createElection(data: {
    title: string;
    startDate: string;
    endDate: string;
  }) {
    const token = localStorage.getItem("token");

    await fetch("/api/elections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        organizationId: orgId,
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
      }),
    });

    setElectionOpen(false);
    fetchData();
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

      <CreateElectionModal
        open={electionOpen}
        onClose={() => setElectionOpen(false)}
        onCreate={createElection}
      />

      <div className="space-y-6">

        {/* HERO */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold">{org.name}</h1>

          <p className="text-blue-100 mt-2">
            {org.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div>
              <div className="flex items-center gap-2">
                <Wallet size={18}/>
                <span className="text-sm">Treasury</span>
              </div>

              <h2 className="text-2xl font-bold mt-2">
                {org.treasury} ETH
              </h2>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Users size={18}/>
                <span className="text-sm">Members</span>
              </div>

              <h2 className="text-2xl font-bold mt-2">
                {org.members}
              </h2>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <FolderKanban size={18}/>
                <span className="text-sm">Groups</span>
              </div>

              <h2 className="text-2xl font-bold mt-2">
                {groups.length}
              </h2>
            </div>
          </div>
        </div>

        {/* INVITATION CODE */}
        <div className="bg-white border rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold">
                Invitation Code
              </h2>

              <p className="text-gray-500 text-sm">
                Share this code so members can join your organization.
              </p>
            </div>

            <button
              onClick={copyCode}
              className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              {copied ? (
                <>
                  <Check size={18}/>
                  Copied
                </>
              ) : (
                <>
                  <Copy size={18}/>
                  Copy Code
                </>
              )}
            </button>
          </div>

          <div className="mt-5 bg-blue-50 border border-blue-200 rounded-xl p-5 flex items-center justify-between">
            <h3 className="text-xl md:text-2xl font-bold tracking-[0.25em] text-blue-700">
              {org.code}
            </h3>

            <span className="hidden md:block text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Active
            </span>
          </div>
        </div>

        {/* VALIDATOR ELECTION */}
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-xl font-bold">
                Validator Election
              </h2>

              <p className="text-gray-500">
                Members elect validators democratically.
              </p>
            </div>

            <button
              onClick={() => setElectionOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Open Session
            </button>
          </div>

          {elections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No election session available.
            </div>
          ) : (
            <div className="space-y-3">
              {elections.map((election) => (
                <Link
                  key={election._id}
                  href={`/organization/${org.slug}/election/${election._id}`}
                >
                  <div className="border rounded-xl p-4 hover:shadow transition">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">
                          {election.title}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {new Date(election.startDate).toLocaleDateString()} -{" "}
                          {new Date(election.endDate).toLocaleDateString()}
                        </p>
                      </div>

                      <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-600">
                        {election.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* GROUP HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">
              Organization Groups
            </h2>

            <p className="text-gray-500">
              Manage proposal groups
            </p>
          </div>

          <button
            onClick={() => setGroupOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={18}/>
            Create Group
          </button>
        </div>

        {/* GROUP LIST */}
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

                  <Users className="text-blue-600"/>
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