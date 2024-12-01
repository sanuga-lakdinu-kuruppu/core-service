import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    scheduleId: {
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
    departureTime: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 5,
      match: /^[0-2][0-9]:[0-5][0-9]$/,
    },
    arrivalTime: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 5,
      match: /^[0-2][0-9]:[0-5][0-9]$/,
    },
    startLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
    endLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    permit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permit",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Schedule = mongoose.model("Schedule", scheduleSchema);
