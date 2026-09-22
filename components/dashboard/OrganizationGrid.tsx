import Link from "next/link";
import { Users } from "lucide-react";

interface Organization {
  _id: string;
  name: string;
  slug: string;
  description: string;
  treasury: number;
  members: number;
}

interface Props {
  loading: boolean;
  organizations: Organization[];
}

export default function OrganizationGrid({
  loading,
  organizations,
}: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white border rounded-xl p-5 animate-pulse"
          >
            <div className="h-5 w-40 bg-gray-200 rounded mb-3" />
            <div className="h-3 w-24 bg-gray-200 rounded mb-6" />
            <div className="h-3 w-full bg-gray-100 rounded mb-2" />
            <div className="h-3 w-2/3 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-10 text-center">
        <Users size={42} className="mx-auto text-gray-300" />

        <h3 className="mt-4 text-lg font-semibold">
          No Organizations
        </h3>

        <p className="text-gray-500 mt-2">
          Create your first organization or join one.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Your Organizations
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {organizations.map((org) => (
          <Link
            key={org._id}
            href={`/organization/${org.slug}`}
          >
            <div className="bg-white border rounded-xl p-5 hover:shadow-lg transition">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold text-lg">
                    {org.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {org.members} Members
                  </p>
                </div>

                <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                  Admin
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-4 line-clamp-2">
                {org.description}
              </p>

              <div className="mt-5 pt-4 border-t flex justify-between">
                <span>Treasury</span>

                <span className="font-bold text-green-600">
                  {org.treasury} ETH
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}