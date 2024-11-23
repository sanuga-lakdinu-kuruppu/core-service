import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    routeId: {
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
    routeNumber: {
      type: String,
      required: true,
      maxLength: 50,
    },
    routeName: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    travelDistance: {
      type: String,
      required: false,
      maxlength: 10,
    },
    travelDuration: {
      type: String,
      required: false,
      maxlength: 10,
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
  },
  {
    timestamps: true,
  }
);

export const Route = mongoose.model("Route", routeSchema);
