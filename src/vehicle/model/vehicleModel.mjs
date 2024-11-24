import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    vehicleId: {
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
    registrationNumber: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    model: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    capacity: {
      type: Number,
      required: true,
      max: 200,
      min: 1,
    },
    type: {
      type: String,
      required: true,
      maxlength: 20,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      maxlength: 10,
      trim: true,
    },
    airCondition: {
      type: Boolean,
      required: true,
      default: false,
    },
    adjustableSeats: {
      type: Boolean,
      required: true,
      default: false,
    },
    chargingCapability: {
      type: Boolean,
      required: true,
      default: false,
    },
    restStops: {
      type: Boolean,
      required: true,
      default: false,
    },
    movie: {
      type: Boolean,
      required: true,
      default: false,
    },
    music: {
      type: Boolean,
      required: true,
      default: false,
    },
    cupHolder: {
      type: Boolean,
      required: true,
      default: false,
    },
    emergencyExit: {
      type: Boolean,
      required: true,
      default: false,
    },
    pricePerSeat: {
      type: Number,
      required: true,
      max: 20000,
    },
    bookingClose: {
      type: Number,
      required: true,
      max: 10,
      default: 1,
    },
    cancellationPolicy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Policy",
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

export const Vehicle = mongoose.model("Vehicle", vehicleSchema);
