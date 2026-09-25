import { Users, Trash2 } from "lucide-react";

<<<<<<< HEAD
interface Member {
  _id: string;
  name: string;
  walletAddress: string;
  role: "Admin" | "Member" | "Validator";
}

interface Props {
  members: Member[];
  myRole: string;
  onSetValidator: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function MemberList({
  members,
  myRole,
  onSetValidator,
  onRemove,
}: Props) {
  return (
    <div className="bg-white rounded-none border p-6 shadow-brutal">
      <h2 className="text-xl font-bold mb-4">Organization Members</h2>

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member._id}
            className="border rounded-none p-4 flex items-center justify-between shadow-brutal"
          >
            <div className="flex gap-3 items-center">
              <div className="w-11 h-11 rounded-full bg-accent-soft flex items-center justify-center">
                <Users className="text-primary" />
              </div>

              <div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-xs text-gray-500 font-mono">
                  {member.walletAddress || "Wallet not connected"}
                </p>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              {member.role === "Admin" ? (
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
                  Leader
                </span>
              ) : member.role === "Validator" ? (
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                  Validator
                </span>
              ) : (
                myRole === "Admin" && (
                  <button
                    onClick={() => onSetValidator(member._id)}
                    className="px-3 py-1 bg-primary text-white rounded-none text-sm border-2 border-foreground shadow-brutal"
                  >
                    Set Validator
                  </button>
                )
              )}

              {myRole === "Admin" && member.role !== "Admin" && (
                <button
                  onClick={() => onRemove(member._id)}
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              )}
=======
interface Member { _id: string; name: string; walletAddress: string; role: "Admin" | "Member" | "Validator"; }
interface Props { members: Member[]; myRole: string; onRemove: (id: string) => void; }

export default function MemberList({ members, myRole, onRemove }: Props) {
  return (
    <div className="bg-white rounded-none border p-6 shadow-brutal">
      <h2 className="text-xl font-bold mb-4">Organization Members</h2>
      <p className="text-sm text-gray-500 mb-4">Validator roles are managed inside each group.</p>
      <div className="space-y-3">
        {members.map((member) => (
          <div key={member._id} className="border rounded-none p-4 flex items-center justify-between shadow-brutal">
            <div className="flex gap-3 items-center">
              <div className="w-11 h-11 rounded-full bg-accent-soft flex items-center justify-center"><Users className="text-primary" /></div>
              <div><h3 className="font-semibold">{member.name}</h3><p className="text-xs text-gray-500 font-mono">{member.walletAddress || "Wallet not connected"}</p></div>
            </div>
            <div className="flex gap-2 items-center">
              {member.role === "Admin" ? <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">Admin</span> : myRole === "Admin" ? <button onClick={() => { if (window.confirm(`Remove ${member.name} from the organization?`)) onRemove(member._id); }} className="text-red-500" aria-label={`Remove ${member.name}`}><Trash2 size={18} /></button> : null}
>>>>>>> master
            </div>
          </div>
        ))}
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> master
