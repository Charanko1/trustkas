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