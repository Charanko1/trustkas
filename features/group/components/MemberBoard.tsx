import { CheckCircle } from "lucide-react";
import { Member } from "@/types/group";

export default function MemberBoard({
  members,
}:{members:Member[]}){

  if(!members.length){
    return(
      <div className="bg-white border rounded-none p-8 text-center shadow-brutal">
        No members
      </div>
    );
  }

  return(
    <div className="space-y-4">
      {members.map(member=>(
        <div
          key={member._id}
          className="bg-white border rounded-none p-4 flex flex-wrap gap-3 justify-between items-center shadow-brutal"
        >
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              {member.name.charAt(0)}
            </div>

            <div>
              <h3 className="font-semibold">
                {member.name}
              </h3>

              <p className="text-sm text-gray-500">
                {member.role}
              </p>

              <p className="text-xs text-gray-400">
                {member.walletAddress}
              </p>
            </div>
          </div>

          {member.role==="Admin" && (
            <CheckCircle className="text-green-600"/>
          )}
        </div>
      ))}
    </div>
  );
}