import { Users, Trash2 } from "lucide-react";

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
    <div className="bg-white rounded-2xl border p-6">
      <h2 className="text-xl font-bold mb-4">Organization Members</h2>

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member._id}
            className="border rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex gap-3 items-center">
              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="text-blue-600" />
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
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}