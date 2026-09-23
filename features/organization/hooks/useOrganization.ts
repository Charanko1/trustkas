"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { apiClient } from "@/lib/api-client";
import type { OrganizationSummary } from "@/types/organization";

interface Organization extends OrganizationSummary { code: string; }
interface Group { _id: string; name: string; description: string; leader: string; members: number; joined: boolean; pending: boolean; }
interface Member { _id: string; userId: string; name: string; walletAddress: string; role: "Admin" | "Member" | "Validator"; }
interface JoinRequest { _id: string; membershipId: string; groupId: string; groupName: string; memberName: string; walletAddress?: string; createdAt: string; }

export function useOrganization(orgId: string) {
  const client = useQueryClient();
  const { profile } = useProfile();
  const query = useQuery({ queryKey: ["organization", orgId], enabled: !!orgId, queryFn: async ({ signal }) => {
    const [org, groups, members] = await Promise.all([
      apiClient<Organization>(`/api/organizations/${orgId}`, { signal }),
      apiClient<Group[]>(`/api/groups?organization=${orgId}`, { signal }),
      apiClient<Member[]>(`/api/memberships?organization=${orgId}`, { signal }),
    ]);
    return { org, groups, members };
  } });
  const myRole = query.data?.members.find(member => member.userId === profile?._id)?.role || "Member";
  const requests = useQuery({ queryKey: ["join-requests", orgId], enabled: myRole === "Admin", queryFn: ({ signal }) => apiClient<JoinRequest[]>(`/api/groups/join-requests?organization=${orgId}`, { signal }) });
  async function refresh() {
    await Promise.all([client.invalidateQueries({ queryKey: ["organization", orgId] }), client.invalidateQueries({ queryKey: ["join-requests", orgId] }), client.invalidateQueries({ queryKey: ["history"] })]);
  }
  return { org: query.data?.org, groups: query.data?.groups || [], members: query.data?.members || [], requests: requests.data || [], myRole, loading: query.isPending, error: query.error || requests.error, refresh };
}
