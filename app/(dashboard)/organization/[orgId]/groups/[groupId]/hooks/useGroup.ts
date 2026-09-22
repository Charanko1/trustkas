"use client";

import { useEffect, useState } from "react";
import type {
  GroupData,
  Member,
  Proposal,
  CreateProposalData,
} from "../types";

export function useGroup(groupId: string) {
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<GroupData | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [currentRole, setCurrentRole] =
    useState<"Admin" | "Member">("Member");

  useEffect(() => {
    if (groupId) fetchData();
  }, [groupId]);

  async function fetchData() {
    try {
      setLoading(true);

      const token = localStorage.getItem("token") || "";

      const [g, p, m] = await Promise.all([
        fetch(`/api/groups/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`/api/proposals?group=${groupId}`),
        fetch(`/api/groups/${groupId}/members`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const groupData = await g.json();

      setGroup(groupData);
      setCurrentRole(groupData.isLeader ? "Admin" : "Member");

      const proposalData = await p.json();
      const memberData = await m.json();

      setProposals(Array.isArray(proposalData) ? proposalData : []);
      setMembers(Array.isArray(memberData) ? memberData : []);
    } catch (err) {
      console.error(err);
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

    await fetchData();
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
      body: JSON.stringify({
        status,
        validator: "Admin",
      }),
    });

    await fetchData();
  }

  return {
    loading,
    group,
    members,
    proposals,
    currentRole,
    createProposal,
    updateStatus,
    refresh: fetchData,
  };
}