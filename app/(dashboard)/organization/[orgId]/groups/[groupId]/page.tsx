"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import GroupHeader from "@/components/group/GroupHeader";
import GroupTabs from "@/components/group/GroupTabs";
import ProposalBoard from "@/components/group/ProposalBoard";
import MemberBoard from "@/components/group/MemberBoard";
import AboutBoard from "@/components/group/AboutBoard";

export interface Member {
  _id: string;
  name: string;
  role: string;
  walletAddress?: string;
}

export interface GroupData {
  _id: string;
  name: string;
  description: string;
  leader: string;
  organizationName: string;
  members: number;
  totalProposal: number;
  isLeader: boolean;
}

export interface Proposal {
  _id: string;
  title: string;
  description: string;
  creator: string;
  targetAmount: number;
  fundedAmount: number;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy: string;
}

interface CreateProposalData {
  title: string;
  description: string;
  target: number;
  deadline: string;
}

export default function GroupPage() {
  const { orgId, groupId } = useParams() as {
    orgId: string;
    groupId: string;
  };

  const [tab, setTab] = useState("proposal");

  const [group, setGroup] = useState<GroupData | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState<"Admin" | "Member">("Member");

  useEffect(() => {
    fetchData();
  }, [groupId]);

  async function fetchData() {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const [g, p, m] = await Promise.all([
        fetch(`/api/groups/${groupId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/proposals?group=${groupId}`),
        fetch(`/api/groups/${groupId}/members`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const groupData = await g.json();

      setGroup(groupData);
      setCurrentRole(groupData.isLeader ? "Admin" : "Member");

      setProposals(await p.json());
      setMembers(await m.json());
    } finally {
      setLoading(false);
    }
  }

  async function createProposal(data: CreateProposalData) {
    await fetch("/api/proposals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        targetAmount: data.target,
        deadline: data.deadline,
        groupId,
      }),
    });

    fetchData();
  }

  async function updateStatus(
    id: string,
    status: "Approved" | "Rejected"
  ) {
    await fetch(`/api/proposals/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    fetchData();
  }

  if (loading || !group) {
    return (
      <div className="flex justify-center mt-20">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GroupHeader group={group} />

      <GroupTabs
        tab={tab}
        setTab={setTab}
      />

      {tab === "proposal" && (
        <ProposalBoard
          proposals={proposals}
          currentRole={currentRole}
          group={group}
          orgId={orgId}
          groupId={groupId}
          onCreate={createProposal}
          onApprove={(id) => updateStatus(id, "Approved")}
          onReject={(id) => updateStatus(id, "Rejected")}
        />
      )}

      {tab === "members" && (
        <MemberBoard members={members} />
      )}

      {tab === "about" && (
        <AboutBoard group={group} />
      )}
    </div>
  );
}