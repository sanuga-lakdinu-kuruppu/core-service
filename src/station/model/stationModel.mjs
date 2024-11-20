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
      minlength: 1,
      maxlength: 50,
    },
    coordinates: {
      lat: {
        type: Number,
        min: -90,
        max: 90,
      },
      log: {
        type: Number,
        min: -180,
        max: 180,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Station = mongoose.model("Station", stationSchema);
