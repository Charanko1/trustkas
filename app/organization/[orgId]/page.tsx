"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Wallet,
  Users,
  FolderKanban,
  Plus,
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

  useEffect(() => {
    fetchOrganization();
    fetchGroups();
    fetchElections();
  }, [orgId]);

  async function fetchOrganization() {
    const res = await fetch(`/api/organizations/${orgId}`);
    const data = await res.json();
    setOrg(data);
  }

  async function fetchGroups() {
    const res = await fetch(
      `/api/groups?organization=${orgId}`
    );

    const data = await res.json();
    setGroups(data);
    setLoading(false);
  }

  async function fetchElections() {
    const res = await fetch(
      `/api/elections?organization=${orgId}`
    );

    const data = await res.json();
    setElections(data);
  }

  async function createGroup(group: {
    name: string;
    description: string;
  }) {
    await fetch("/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: group.name,
        description: group.description,
        organizationSlug: orgId,
      }),
    });

    setGroupOpen(false);
    fetchGroups();
  }

  async function createElection(data: {
    title: string;
    startDate: string;
    endDate: string;
  }) {
    await fetch("/api/elections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organizationId: orgId,
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
      }),
    });

    setElectionOpen(false);
    fetchElections();
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
      {/* Create Group Modal */}
      <CreateGroupModal
        open={groupOpen}
        onClose={() => setGroupOpen(false)}
        onCreate={createGroup}
      />

      {/* Create Election Modal */}
      <CreateElectionModal
        open={electionOpen}
        onClose={() => setElectionOpen(false)}
        onCreate={createElection}
      />

      <div className="space-y-8">

        {/* ================= HERO ================= */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold">
            {org.name}
          </h1>

          <p className="text-blue-100 mt-2">
            {org.description}
          </p>

          <div className="grid grid-cols-3 gap-6 mt-8">

            <div>
              <div className="flex items-center gap-2">
                <Wallet size={18}/>
                <span className="text-sm">
                  Treasury
                </span>
              </div>

              <h2 className="text-2xl font-bold mt-2">
                {org.treasury} POL
              </h2>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Users size={18}/>
                <span className="text-sm">
                  Members
                </span>
              </div>

              <h2 className="text-2xl font-bold mt-2">
                {org.members}
              </h2>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <FolderKanban size={18}/>
                <span className="text-sm">
                  Groups
                </span>
              </div>

              <h2 className="text-2xl font-bold mt-2">
                {groups.length}
              </h2>
            </div>

          </div>
        </div>

        {/* ================= VALIDATOR ELECTION ================= */}
        <div className="bg-white rounded-2xl border p-6">

          <div className="flex justify-between items-center mb-5">

            <div>
              <h2 className="text-xl font-bold">
                Validator Election
              </h2>

              <p className="text-gray-500">
                Members elect the validator democratically.
              </p>
            </div>

            <button
              onClick={() => setElectionOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
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
                  className="block"
                >
                  <div className="border rounded-xl p-4 flex justify-between items-center hover:shadow-md transition cursor-pointer">

                    <div>
                      <h3 className="font-semibold">
                        {election.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {new Date(
                          election.startDate
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(
                          election.endDate
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        election.status === "Registration"
                          ? "bg-blue-100 text-blue-600"
                          : election.status === "Voting"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {election.status}
                    </span>

                  </div>
                </Link>
              ))}

            </div>
          )}

        </div>

        {/* ================= GROUP HEADER ================= */}
        <div className="flex justify-between items-center">

          <div>
            <h2 className="text-2xl font-bold">
              Organization Groups
            </h2>

            <p className="text-gray-500">
              Manage proposal groups inside your organization
            </p>
          </div>

          <button
            onClick={() => setGroupOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus size={18}/>
            Create Group
          </button>

        </div>

        {/* ================= GROUP LIST ================= */}
        <div className="grid grid-cols-2 gap-5">

          {groups.map((group) => (
            <Link
              key={group._id}
              href={`/organization/${org.slug}/groups/${group._id}`}
              className="block"
            >
              <div className="bg-white border rounded-xl p-5 hover:shadow-lg transition cursor-pointer">

                <div className="flex justify-between items-start">

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