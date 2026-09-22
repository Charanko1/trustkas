import mongoose, { Schema, models } from "mongoose";

const GroupMemberSchema = new Schema(
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

    role: {
      type: String,
      enum: ["Admin", "Member"], // ← ganti Leader jadi Admin
      default: "Member",
    },
  },
  {
    timestamps: true,
  }
);

// Mencegah member yang sama masuk dua kali ke group yang sama
GroupMemberSchema.index(
  { groupId: 1, membershipId: 1 },
  { unique: true }
);

export default models.GroupMember ||
  mongoose.model("GroupMember", GroupMemberSchema);