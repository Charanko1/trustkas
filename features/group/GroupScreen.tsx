"use client";

import dynamic from "next/dynamic";
import { ErrorState, LoadingState } from "@/components/ui/ContentState";
import { useState } from "react";
import { useParams } from "next/navigation";

import GroupHeader from "@/features/group/components/GroupHeader";
import GroupTabs from "@/features/group/components/GroupTabs";
import ProposalBoard from "@/features/group/components/ProposalBoard";
const MemberBoard = dynamic(() => import("./components/MemberBoard"));
const AboutBoard = dynamic(() => import("./components/AboutBoard"));

import { useGroup } from "./hooks/useGroup";

export default function GroupPage() {
  const { orgId, groupId } = useParams() as {
    orgId: string;
    groupId: string;
  };

  const [tab, setTab] = useState("proposal");

  const {
    loading,
    error,
    refresh,
    group,
    members,
    proposals,
    currentRole,
    createProposal,
    updateStatus,
  } = useGroup(groupId);

  if (loading) return <LoadingState label="Opening your group…" />;
  if (error || !group) return <ErrorState message={error?.message || "Group not found."} onRetry={() => void refresh()} />;

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

      {tab === "members" && <MemberBoard members={members} />}

      {tab === "about" && <AboutBoard group={group} />}
    </div>
  );
}