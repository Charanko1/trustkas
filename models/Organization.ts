import { Schema, model, models } from "mongoose";

const OrganizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
      required: true,
    },

    description: String,

    treasury: {
      type: Number,
      default: 0,
    },

    members: {
      type: Number,
      default: 1,
    },

    owner: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Organization ||
  model("Organization", OrganizationSchema);