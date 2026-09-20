import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    wallet: {
      type: String,
      unique: true,
      required: true,
    },

    email: String,
  },
  {
    timestamps: true,
  }
);

export default models.User || model("User", UserSchema);