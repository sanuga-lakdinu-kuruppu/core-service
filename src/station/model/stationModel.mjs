import mongoose from "mongoose";

const stationSchema = new mongoose.Schema(
  {
    stationId: {
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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    coordinates: {
      lat: {
        type: Number,
      },
      log: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Station = mongoose.model("Station", stationSchema);
