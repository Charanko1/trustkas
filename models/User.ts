import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["member", "validator", "admin"],
      default: "member",
    },

    walletAddress: {
      type: String,
      default: "",
<<<<<<< HEAD
=======
      trim: true,
    },

    walletNonce: {
      type: String,
      default: "",
    },

    walletNonceExpiresAt: {
      type: Date,
      default: null,
    },

    walletVerifiedAt: {
      type: Date,
      default: null,
>>>>>>> master
    },
  },
  {
    timestamps: true,
  }
);

<<<<<<< HEAD
=======
// Wallets are globally unique, but legacy users may still have the empty string.
// A partial index prevents two real users from claiming the same wallet in a race.
UserSchema.index(
  { walletAddress: 1 },
  { unique: true, partialFilterExpression: { walletAddress: { $gt: "" } } }
);

>>>>>>> master
export default models.User || model("User", UserSchema);