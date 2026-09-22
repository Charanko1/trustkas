import Link from "next/link";
import { Users, Plus } from "lucide-react";

interface Props {
  groups: any[];
  org: any;
  myRole: string;
  requests: any[];
  onOpenCreate: () => void;
  onOpenRequests: () => void;
  onJoin: (id: string) => void;
}

export default function GroupList({
  groups,
  org,
  myRole,
  requests,
  onOpenCreate,
  onOpenRequests,
  onJoin,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <div className="flex justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold">Organization Groups</h2>
          <p className="text-gray-500">
            Every member can view groups.
          </p>
        </div>

        {myRole === "Admin" && (
          <div className="flex gap-3">
            <button
              onClick={onOpenRequests}
              className="border px-4 py-2 rounded-lg"
            >
              Join Requests ({requests.length})
            </button>

            <button
              onClick={onOpenCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2"
            >
              <Plus size={18} />
              Create
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {groups.map((group) => (
          <div
            key={group._id}
            className="border rounded-xl p-5"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold text-lg">{group.name}</h3>
                <p className="text-sm text-gray-500">
                  Leader: {group.leader}
                </p>
              </div>

              <Users className="text-blue-600" />
            </div>

            <div className="mt-4 flex justify-between text-sm">
              <span>Members</span>
              <span className="font-semibold">{group.members}</span>
            </div>

            <div className="mt-4">
              {myRole === "Admin" || group.joined ? (
                <Link
                  href={`/organization/${org.slug}/groups/${group._id}`}
                >
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
                    Open Group
                  </button>
                </Link>
              ) : group.pending ? (
                <button
                  disabled
                  className="w-full bg-yellow-100 text-yellow-700 py-2 rounded-lg"
                >
                  Waiting Approval
                </button>
              ) : (
                <button
                  onClick={() => onJoin(group._id)}
                  className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg"
                >
                  Request Join
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}