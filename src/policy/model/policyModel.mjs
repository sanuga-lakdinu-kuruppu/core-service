import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
  {
    policyId: {
      type: Number,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    policyName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 20,
    },
    description: {
      type: String,
      required: false,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  }
);

export const Policy = mongoose.model("Policy", policySchema);
