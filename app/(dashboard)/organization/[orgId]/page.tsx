"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import { useSocket } from "@/context/SocketContext";

import CreateGroupModal from "@/components/group/CreateGroupModal";
import JoinRequestModal from "@/components/group/JoinRequestModal";

import OrganizationHero from "@/components/organization/OrganizationHero";
import OrganizationMenu from "@/components/organization/OrganizationMenu";
import MemberList from "@/components/organization/MemberList";
import GroupList from "@/components/organization/GroupList";

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
  joined: boolean;
  pending: boolean;
}

interface Member {
  _id: string;
  name: string;
  walletAddress: string;
  role: "Admin" | "Member" | "Validator";
}

interface JoinRequest {
  _id: string;
  membershipId: string;
  groupId: string;
  groupName: string;
  memberName: string;
  walletAddress?: string;
  createdAt: string;
}

export default function OrganizationPage() {
  const { orgId } = useParams() as { orgId: string };

  const { address } = useWallet();
  const socket = useSocket();

  const [org, setOrg] = useState<Organization | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [requests, setRequests] = useState<JoinRequest[]>([]);

  const [loading, setLoading] = useState(true);
  const [groupOpen, setGroupOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const [myRole, setMyRole] = useState<
    "Admin" | "Member" | "Validator"
  >("Member");

  useEffect(() => {
    if (orgId) fetchData();
  }, [orgId]);

  // =======================
  // SOCKET REALTIME
  // =======================
  useEffect(() => {
    if (!org || myRole !== "Admin") return;

    socket.emit("join-organization", org._id);

    const refresh = () => fetchData(false);

    socket.on("join-request", refresh);
    socket.on("request-updated", refresh);

    return () => {
      socket.off("join-request", refresh);
      socket.off("request-updated", refresh);
    };
  }, [org, myRole, socket]);

  async function fetchData(showLoading = true) {
    if (showLoading) setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [o, g, m, p, r] = await Promise.all([
        fetch(`/api/organizations/${orgId}`, { headers }),
        fetch(`/api/groups?organization=${orgId}`, { headers }),
        fetch(`/api/memberships?organization=${orgId}`, { headers }),
        fetch("/api/profile", { headers }),
        fetch(`/api/groups/join-requests?organization=${orgId}`, {
          headers,
        }),
      ]);

      const orgData = await o.json();
      const groupData = await g.json();
      const memberData = await m.json();
      const profile = await p.json();
      const requestData = await r.json();

      setOrg(orgData);
      setGroups(Array.isArray(groupData) ? groupData : []);

      const list = Array.isArray(memberData) ? memberData : [];
      setMembers(list);

      const me = list.find(
        (x: Member) => x.name === profile.name
      );

      if (me) {
        setMyRole(me.role);

        setRequests(
          me.role === "Admin" && Array.isArray(requestData)
            ? requestData
            : []
        );
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  const api = async (url: string, opt?: RequestInit) => {
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      ...opt,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(opt?.headers || {}),
      },
    });

    const data = await res.json();

    alert(data.message || "");

    if (res.ok) fetchData(false);
  };

  const copyCode = async () => {
    if (!org) return;

    await navigator.clipboard.writeText(org.code);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !org) {
    return (
      <div className="flex justify-center mt-20">
        Loading...
      </div>
    );
  }

  return (
    <>
      <JoinRequestModal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        requests={requests}
        onApprove={(id) =>
          api(`/api/groups/join-requests/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ action: "Approved" }),
          })
        }
        onReject={(id) =>
          api(`/api/groups/join-requests/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ action: "Rejected" }),
          })
        }
      />

      <CreateGroupModal
        open={groupOpen}
        onClose={() => setGroupOpen(false)}
        onCreate={(g) =>
          api("/api/groups", {
            method: "POST",
            body: JSON.stringify({
              ...g,
              organizationSlug: orgId,
            }),
          })
        }
      />

      <div className="space-y-6">
        <div className="relative">
          <OrganizationHero org={org} groups={groups} />

          <OrganizationMenu
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            copied={copied}
            code={org.code}
            copyCode={copyCode}
            exitOrganization={() =>
              api("/api/organizations/exit", {
                method: "DELETE",
                body: JSON.stringify({
                  organizationId: org._id,
                }),
              })
            }
            deleteOrganization={() =>
              api(`/api/organizations/${org._id}`, {
                method: "DELETE",
              })
            }
          />
        </div>

        <MemberList
          members={members}
          myRole={myRole}
          onSetValidator={(id) =>
            api(`/api/memberships/${id}`, {
              method: "PATCH",
              body: JSON.stringify({ role: "Validator" }),
            })
          }
          onRemove={(id) =>
            api(`/api/memberships/${id}`, {
              method: "DELETE",
            })
          }
        />

        <GroupList
          groups={groups}
          org={org}
          myRole={myRole}
          requests={requests}
          onOpenCreate={() => setGroupOpen(true)}
          onOpenRequests={() => setRequestOpen(true)}
          onJoin={(id) =>
            api(`/api/groups/${id}/join`, {
              method: "POST",
            })
          }
        />
      </div>
    </>
  );
}