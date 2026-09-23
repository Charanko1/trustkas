"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { GroupData, Member, Proposal, CreateProposalData } from "@/types/group";

export function useGroup(groupId: string) {
  const client = useQueryClient();
  const key = ["group", groupId];
  const query = useQuery({ queryKey: key, enabled: !!groupId, queryFn: async ({ signal }) => {
    const [group, proposals, members] = await Promise.all([
      apiClient<GroupData>(`/api/groups/${groupId}`, { signal }),
      apiClient<Proposal[]>(`/api/proposals?group=${groupId}`, { signal }),
      apiClient<Member[]>(`/api/groups/${groupId}/members`, { signal }),
    ]);
    return { group, proposals, members };
  } });
  async function refresh() { await client.invalidateQueries({ queryKey: key }); }
  async function createProposal(data: CreateProposalData) {
    await apiClient("/api/proposals", { method: "POST", body: JSON.stringify({ title: data.title, description: data.description, targetAmount: data.target, deadline: data.deadline, groupId }) });
    await Promise.all([refresh(), client.invalidateQueries({ queryKey: ["history"] })]);
  }
  async function updateStatus(id: string, status: "Approved" | "Rejected") {
    try {
      await apiClient(`/api/proposals/${id}`, { method: "PATCH", body: JSON.stringify({ status, validator: "Admin" }) });
      await Promise.all([refresh(), client.invalidateQueries({ queryKey: ["proposal", id] }), client.invalidateQueries({ queryKey: ["history"] })]);
    } catch (error) { alert(error instanceof Error ? error.message : "Could not update the proposal."); }
  }
  return { loading: query.isPending, error: query.error, group: query.data?.group, members: query.data?.members || [], proposals: query.data?.proposals || [], currentRole: (query.data?.group.isLeader ? "Admin" : "Member") as "Admin" | "Member", createProposal, updateStatus, refresh };
}
