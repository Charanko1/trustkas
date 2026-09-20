import { Schema, model, models } from "mongoose";

const GroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: String,

    organizationSlug: {
      type: String,
      required: true,
    },

    leader: {
      type: String,
      required: true,
    },

    members: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Group || model("Group", GroupSchema);