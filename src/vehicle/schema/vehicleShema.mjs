import { Policy } from "../../policy/model/policyModel.mjs";
import { BusOperator } from "../../busOperator/model/busOperatorModel.mjs";

export const vehicleSchema = {
  registrationNumber: {
    notEmpty: {
      errorMessage: "registrationNumber cannot by empty",
    },
    isString: {
      errorMessage: "registrationNumber must be a string",
    },
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: "registrationNumber must be between 1 and 50 characters",
    },
    trim: true,
  },
  model: {
    notEmpty: {
      errorMessage: "model cannot by empty",
    },
    isString: {
      errorMessage: "model must be a string",
    },
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: "model must be between 1 and 50 characters",
    },
    trim: true,
  },
  capacity: {
    notEmpty: {
      errorMessage: "capacity cannot by empty",
    },
    isNumeric: {
      errorMessage: "capacity must be a number",
    },
    custom: {
      options: (value) => value > 1 && value <= 200,
      errorMessage: "capacity must be between 1 and 200",
    },
  },
  type: {
    notEmpty: {
      errorMessage: "type cannot by empty",
    },
    isString: {
      errorMessage: "type must be a string",
    },
    isLength: {
      options: {
        max: 20,
      },
      errorMessage: "type must be less than 20 characters",
    },
    trim: true,
  },
  status: {
    notEmpty: {
      errorMessage: "status cannot by empty",
    },
    isString: {
      errorMessage: "status must be a string",
    },
    isLength: {
      options: {
        max: 10,
      },
      errorMessage: "status must be less than 10 characters",
    },
    trim: true,
  },
  airCondition: {
    isBoolean: {
      errorMessage: "airCondition must be a boolean",
    },
    notEmpty: {
      errorMessage: "airCondition cannot be empty",
    },
    isIn: {
      options: [[true, false]],
      errorMessage: "airCondition must be either true or false",
    },
  },
  adjustableSeats: {
    isBoolean: {
      errorMessage: "adjustableSeats must be a boolean",
    },
    notEmpty: {
      errorMessage: "adjustableSeats cannot be empty",
    },
    isIn: {
      options: [[true, false]],
      errorMessage: "adjustableSeats must be either true or false",
    },
  },
  chargingCapability: {
    isBoolean: {
      errorMessage: "chargingCapability must be a boolean",
    },
    notEmpty: {
      errorMessage: "chargingCapability cannot be empty",
    },
    isIn: {
      options: [[true, false]],
      errorMessage: "chargingCapability must be either true or false",
    },
  },
  restStops: {
    isBoolean: {
      errorMessage: "restStops must be a boolean",
    },
    notEmpty: {
      errorMessage: "restStops cannot be empty",
    },
    isIn: {
      options: [[true, false]],
      errorMessage: "restStops must be either true or false",
    },
  },
  movie: {
    isBoolean: {
      errorMessage: "movie must be a boolean",
    },
    notEmpty: {
      errorMessage: "movie cannot be empty",
    },
    isIn: {
      options: [[true, false]],
      errorMessage: "movie must be either true or false",
    },
  },
  music: {
    isBoolean: {
      errorMessage: "music must be a boolean",
    },
    notEmpty: {
      errorMessage: "music cannot be empty",
    },
    isIn: {
      options: [[true, false]],
      errorMessage: "music must be either true or false",
    },
  },
  cupHolder: {
    isBoolean: {
      errorMessage: "cupHolder must be a boolean",
    },
    notEmpty: {
      errorMessage: "cupHolder cannot be empty",
    },
    isIn: {
      options: [[true, false]],
      errorMessage: "cupHolder must be either true or false",
    },
  },
  emergencyExit: {
    isBoolean: {
      errorMessage: "emergencyExit must be a boolean",
    },
    notEmpty: {
      errorMessage: "emergencyExit cannot be empty",
    },
    isIn: {
      options: [[true, false]],
      errorMessage: "emergencyExit must be either true or false",
    },
  },
  pricePerSeat: {
    notEmpty: {
      errorMessage: "pricePerSeat cannot by empty",
    },
    isNumeric: {
      errorMessage: "pricePerSeat must be a number",
    },
    custom: {
      options: (value) => value <= 20000,
      errorMessage: "pricePerSeat must be less than 20000",
    },
  },
  bookingClose: {
    notEmpty: {
      errorMessage: "bookingClose cannot by empty",
    },
    isNumeric: {
      errorMessage: "bookingClose must be a number",
    },
    custom: {
      options: (value) => value <= 10,
      errorMessage: "bookingClose must be less than 10",
    },
  },
  cancellationPolicyId: {
    notEmpty: {
      errorMessage: "cancellationPolicyId is required",
    },
    isNumeric: {
      errorMessage: "cancellationPolicyId should be a number",
    },
    custom: {
      options: async (value) => {
        const policy = await Policy.findOne({ policyId: value });
        if (!policy) {
          throw new Error(
            "cancellationPolicyId does not exist in the database"
          );
        }
        return true;
      },
    },
  },
  busOperatorId: {
    notEmpty: {
      errorMessage: "busOperatorId is required",
    },
    isNumeric: {
      errorMessage: "busOperatorId should be a number",
    },
    custom: {
      options: async (value) => {
        const operator = await BusOperator.findOne({ operatorId: value });
        if (!operator) {
          throw new Error("busOperatorId does not exist in the database");
        }
        return true;
      },
    },
  },
};
