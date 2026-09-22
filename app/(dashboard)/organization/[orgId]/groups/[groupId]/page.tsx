"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import GroupHeader from "@/components/group/GroupHeader";
import GroupTabs from "@/components/group/GroupTabs";
import ProposalBoard from "@/components/group/ProposalBoard";
import MemberBoard from "@/components/group/MemberBoard";
import AboutBoard from "@/components/group/AboutBoard";

import { useGroup } from "./hooks/useGroup";

export default function GroupPage() {
  const { orgId, groupId } = useParams() as {
    orgId: string;
    groupId: string;
  };

  const [tab, setTab] = useState("proposal");

  const {
    loading,
    group,
    members,
    proposals,
    currentRole,
    createProposal,
    updateStatus,
  } = useGroup(groupId);

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

      {tab === "members" && <MemberBoard members={members} />}

      {tab === "about" && <AboutBoard group={group} />}
    </div>
  );
}