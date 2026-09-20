import mongoose, { Schema, models } from "mongoose";

const ElectionSchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Registration", "Voting", "Closed"],
      default: "Registration",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default models.Election ||
  mongoose.model("Election", ElectionSchema);