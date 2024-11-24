import mongoose from "mongoose";

const busOperatorSchema = new mongoose.Schema(
  {
    operatorId: {
      type: Number,
      required: true,
      unique: true,
    },
    federatedUserId: {
      type: String,
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
      firstName: {
        type: String,
        minlength: 1,
        maxlength: 20,
        trim: true,
        required: true,
      },
      lastName: {
        type: String,
        minlength: 1,
        maxlength: 20,
        trim: true,
        required: true,
      },
    },
    company: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    contact: {
      mobile: {
        type: String,
        minlength: 9,
        maxlength: 12,
        trim: true,
        required: true,
      },
      email: {
        type: String,
        minlength: 10,
        maxlength: 100,
        trim: true,
        required: true,
      },
      address: {
        no: {
          type: String,
          minlength: 1,
          maxlength: 10,
          trim: true,
          required: false,
        },
        street1: {
          type: String,
          minlength: 1,
          maxlength: 50,
          trim: true,
          required: true,
        },
        street2: {
          type: String,
          minlength: 1,
          maxlength: 50,
          trim: true,
          required: false,
        },
        street3: {
          type: String,
          minlength: 1,
          maxlength: 50,
          trim: true,
          required: false,
        },
        city: {
          type: String,
          minlength: 1,
          maxlength: 50,
          trim: true,
          required: true,
        },
        district: {
          type: String,
          minlength: 1,
          maxlength: 20,
          trim: true,
          required: true,
        },
        province: {
          type: String,
          minlength: 1,
          maxlength: 20,
          trim: true,
          required: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

export const BusOperator = mongoose.model("BusOperator", busOperatorSchema);
