import mongoose from "mongoose";

const permitSchema = new mongoose.Schema(
  {
    permitId: {
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
    permitNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 20,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      default: Date.now,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    busOperator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusOperator",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Permit = mongoose.model("Permit", permitSchema);
