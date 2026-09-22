import mongoose, { Schema, models } from "mongoose";

const HistorySchema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "DONATION",
        "WITHDRAW",
        "PROPOSAL",
        "APPROVAL",
        "VALIDATOR",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    amount: {
      type: Number,
      default: 0,
    },

    txHash: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default models.History ||
  mongoose.model("History", HistorySchema);