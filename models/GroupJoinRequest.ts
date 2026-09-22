import mongoose, { Schema, models } from "mongoose";

const GroupJoinRequestSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    membershipId: {
      type: Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// Satu member hanya boleh punya 1 request aktif per group
GroupJoinRequestSchema.index(
  { groupId: 1, membershipId: 1 },
  { unique: true }
);

export default models.GroupJoinRequest ||
  mongoose.model("GroupJoinRequest", GroupJoinRequestSchema);