import { Copy, Wallet } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-500">
          Your wallet and organization membership.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            R
          </div>

          <div>
            <h2 className="text-2xl font-bold">Ridwan Aziz</h2>
            <p className="text-gray-500">Student Member</p>
          </div>
        </div>

        <div className="border-t mt-6 pt-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Wallet</span>

            <div className="flex items-center gap-2">
              <Wallet size={18} />
              <span>0xA91F...72D</span>
              <Copy size={16} className="cursor-pointer" />
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Total Donation</span>
            <span className="font-semibold">120 POL</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Organizations</span>
            <span className="font-semibold">2</span>
          </div>
        </div>
      </div>

      {/* Joined Organizations */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-bold mb-4">
          Joined Organizations
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 rounded-lg border">
            <div>
              <h3 className="font-semibold">HIMA Informatika</h3>
              <p className="text-sm text-gray-500">Member</p>
            </div>

            <span className="text-blue-600 font-semibold">
              1,250 POL
            </span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-lg border">
            <div>
              <h3 className="font-semibold">
                UKM Artificial Intelligence
              </h3>
              <p className="text-sm text-gray-500">Leader</p>
            </div>

            <span className="text-green-600 font-semibold">
              420 POL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}