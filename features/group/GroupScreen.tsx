"use client";

import dynamic from "next/dynamic";
import { ErrorState, LoadingState } from "@/components/ui/ContentState";
import { useState } from "react";
import { useParams } from "next/navigation";
<<<<<<< HEAD

=======
>>>>>>> master
import GroupHeader from "@/features/group/components/GroupHeader";
import GroupTabs from "@/features/group/components/GroupTabs";
import ProposalBoard from "@/features/group/components/ProposalBoard";
const MemberBoard = dynamic(() => import("./components/MemberBoard"));
const AboutBoard = dynamic(() => import("./components/AboutBoard"));
<<<<<<< HEAD

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
=======
import { useGroup } from "./hooks/useGroup";
import GroupJoinRequestBoard from "./components/GroupJoinRequestBoard";

export default function GroupPage() {
  const { orgId, groupId } = useParams() as { orgId: string; groupId: string };
  const [tab, setTab] = useState("proposal");
  const {
    loading, error, refresh, group, members, proposals, joinRequests, currentRole,
    createProposal, deleteProposal, validateProposal, reviewProposal,
    registerProposalOnChain, activateFunding, requestWithdrawal, reviewWithdrawal,
    releaseFund, cancelProposal, setValidator, removeValidator, removeMember, approveJoinRequest, rejectJoinRequest,
>>>>>>> master
  } = useGroup(groupId);

  if (loading) return <LoadingState label="Opening your group…" />;
  if (error || !group) return <ErrorState message={error?.message || "Group not found."} onRetry={() => void refresh()} />;

  return (
    <div className="space-y-6">
      <GroupHeader group={group} />
<<<<<<< HEAD

      <GroupTabs
        tab={tab}
        setTab={setTab}
      />

=======
      <GroupTabs tab={tab} setTab={setTab} showRequests={currentRole === "Admin"} requestCount={joinRequests.length} />
>>>>>>> master
      {tab === "proposal" && (
        <ProposalBoard
          proposals={proposals}
          currentRole={currentRole}
<<<<<<< HEAD
=======
          currentUserId={group.currentUserId}
>>>>>>> master
          group={group}
          orgId={orgId}
          groupId={groupId}
          onCreate={createProposal}
<<<<<<< HEAD
          onApprove={(id) => updateStatus(id, "Approved")}
          onReject={(id) => updateStatus(id, "Rejected")}
        />
      )}

      {tab === "members" && <MemberBoard members={members} />}

      {tab === "about" && <AboutBoard group={group} />}
    </div>
  );
}
=======
          onDelete={(id) => void deleteProposal(id)}
          onValidate={(id, action) => void validateProposal(id, action)}
          onAdminReview={(id, action) => void reviewProposal(id, action)}
          onRegisterOnChain={(id) => void registerProposalOnChain(id)}
          onActivateFunding={(id) => void activateFunding(id)}
          onRequestWithdrawal={(id) => void requestWithdrawal(id)}
          onWithdrawalReview={(id, action) => void reviewWithdrawal(id, action)}
          onRelease={(id) => void releaseFund(id)}
          onCancel={(id) => void cancelProposal(id)}
        />
      )}
      {tab === "join-requests" && currentRole === "Admin" && (
        <GroupJoinRequestBoard requests={joinRequests} onApprove={(id) => void approveJoinRequest(id)} onReject={(id) => void rejectJoinRequest(id)} />
      )}
      {tab === "members" && (
        <MemberBoard
          members={members}
          currentRole={currentRole}
          onSetValidator={(id) => void setValidator(id)}
          onRemoveValidator={(id) => void removeValidator(id)}
          onRemoveMember={(id) => void removeMember(id)}
        />
      )}
      {tab === "about" && <AboutBoard group={group} />}
    </div>
  );
}
>>>>>>> master
