import mongoose, { Schema, models } from "mongoose";

const VoteSchema = new Schema(
  {
    electionId: {
      type: Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },

    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },

    voterId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 1 member hanya boleh vote sekali
VoteSchema.index(
  { electionId: 1, voterId: 1 },
  { unique: true }
);

export default models.Vote ||
  mongoose.model("Vote", VoteSchema);