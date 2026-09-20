"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  User,
  Vote,
  Trophy,
  PlayCircle,
  CheckCircle,
} from "lucide-react";
import NominateModal from "@/components/election/NominateModal";

interface Election {
  _id: string;
  title: string;
  status: "Registration" | "Voting" | "Closed";
  startDate: string;
  endDate: string;
}

interface Candidate {
  _id: string;
  name: string;
  vision: string;
  votes: number;
}

export default function ElectionDetailPage() {
  const params = useParams();
  const electionId = params.electionId as string;

  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // sementara hardcode
  const currentUser = {
    id: "demo-user",
    role: "Admin", // Admin | Member
  };

  useEffect(() => {
    fetchElection();
    fetchCandidates();
  }, [electionId]);

  async function fetchElection() {
    const res = await fetch(`/api/elections/${electionId}`);
    const data = await res.json();
    setElection(data);
  }

  async function fetchCandidates() {
    const res = await fetch(
      `/api/candidates?election=${electionId}`
    );

    const data = await res.json();
    setCandidates(data);
    setLoading(false);
  }

  async function nominate(data: {
    name: string;
    vision: string;
  }) {
    await fetch("/api/candidates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        electionId,
        userId: currentUser.id,
        name: data.name,
        vision: data.vision,
      }),
    });

    setOpen(false);
    fetchCandidates();
  }

  async function voteCandidate(candidateId: string) {
    const res = await fetch("/api/votes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        electionId,
        candidateId,
        voterId: currentUser.id,
      }),
    });

    const data = await res.json();
    alert(data.message);

    fetchCandidates();
  }

  async function updateStatus(
    status: "Voting" | "Closed"
  ) {
    await fetch(`/api/elections/${electionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    fetchElection();
  }

  const winner =
    candidates.length > 0
      ? [...candidates].sort(
          (a, b) => b.votes - a.votes
        )[0]
      : null;

  if (loading || !election) {
    return (
      <div className="flex justify-center mt-20">
        Loading...
      </div>
    );
  }

  return (
    <>
      <NominateModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={nominate}
      />

      <div className="space-y-8">
        {/* ================= HERO ================= */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold">
            {election.title}
          </h1>

          <p className="text-blue-100 mt-2">
            Democratic Validator Selection
          </p>

          <div className="grid grid-cols-3 gap-6 mt-8">
            <div>
              <p className="text-sm text-blue-200">
                Registration
              </p>

              <h3 className="font-semibold">
                {new Date(
                  election.startDate
                ).toLocaleDateString()}
              </h3>
            </div>

            <div>
              <p className="text-sm text-blue-200">
                End Date
              </p>

              <h3 className="font-semibold">
                {new Date(
                  election.endDate
                ).toLocaleDateString()}
              </h3>
            </div>

            <div>
              <p className="text-sm text-blue-200">
                Status
              </p>

              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {election.status}
              </span>
            </div>
          </div>
        </div>

        {/* ================= ADMIN CONTROL ================= */}
        {currentUser.role === "Admin" && (
          <div className="bg-white border rounded-xl p-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg">
                  Election Control
                </h2>

                <p className="text-sm text-gray-500">
                  Only admin can change election phase.
                </p>
              </div>

              <div className="flex gap-3">
                {election.status === "Registration" && (
                  <button
                    onClick={() =>
                      updateStatus("Voting")
                    }
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <PlayCircle size={18}/>
                    Start Voting
                  </button>
                )}

                {election.status === "Voting" && (
                  <button
                    onClick={() =>
                      updateStatus("Closed")
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <CheckCircle size={18}/>
                    Close Election
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= WINNER ================= */}
        {election.status === "Closed" && winner && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-white">
              <Trophy size={30}/>
            </div>

            <div>
              <p className="text-sm text-yellow-700">
                Official Validator
              </p>

              <h2 className="text-2xl font-bold text-yellow-900">
                {winner.name}
              </h2>

              <p className="text-yellow-700">
                {winner.votes} votes received
              </p>
            </div>
          </div>
        )}

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">
              Candidate List
            </h2>

            <p className="text-gray-500">
              Members nominate and vote for validator.
            </p>
          </div>

          {election.status === "Registration" && (
            <button
              onClick={() => setOpen(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              Nominate Me
            </button>
          )}
        </div>

        {/* ================= CANDIDATES ================= */}
        {candidates.length === 0 ? (
          <div className="bg-white border rounded-xl p-12 text-center">
            <User
              size={42}
              className="mx-auto text-gray-300 mb-3"
            />

            <h3 className="font-semibold text-lg">
              No Candidate Yet
            </h3>

            <p className="text-gray-500 mt-1">
              Be the first member to nominate yourself.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {candidates.map((candidate) => (
              <div
                key={candidate._id}
                className="bg-white border rounded-xl p-5"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {candidate.name.charAt(0)}
                      </div>

                      <div>
                        <h3 className="font-bold text-lg">
                          {candidate.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Validator Candidate
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-gray-700">
                      {candidate.vision}
                    </p>
                  </div>

                  <div className="text-center min-w-[90px]">
                    <Vote
                      className="mx-auto text-blue-600 mb-1"
                      size={22}
                    />

                    <h2 className="text-3xl font-bold">
                      {candidate.votes}
                    </h2>

                    <p className="text-xs text-gray-500">
                      Votes
                    </p>
                  </div>
                </div>

                {election.status === "Voting" && (
                  <button
                    onClick={() =>
                      voteCandidate(candidate._id)
                    }
                    className="mt-5 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                  >
                    Vote Candidate
                  </button>
                )}

                {winner?._id === candidate._id &&
                  election.status === "Closed" && (
                    <div className="mt-5 bg-green-50 text-green-700 py-2 rounded-lg text-center font-semibold">
                      Elected Validator
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}