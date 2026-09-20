import mongoose, { Schema, models } from "mongoose";

const CandidateSchema = new Schema(
  {
    electionId: {
      type: Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    vision: {
      type: String,
      required: true,
    },

    votes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default models.Candidate ||
  mongoose.model("Candidate", CandidateSchema);