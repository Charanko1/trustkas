import { Schema, model, models } from "mongoose";

const ProposalSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    creator: {
      type: String,
      required: true,
    },

    targetAmount: {
      type: Number,
      required: true,
    },

    fundedAmount: {
      type: Number,
      default: 0,
    },

    // ===== RIWAYAT DONASI BLOCKCHAIN =====
    transactions: [
      {
        amount: {
          type: Number,
          required: true,
        },

        txHash: {
          type: String,
          required: true,
        },

        donor: {
          type: String,
          default: "",
        },

        donatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    approvedBy: {
      type: String,
      default: "",
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    deadline: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Proposal ||
  model("Proposal", ProposalSchema);