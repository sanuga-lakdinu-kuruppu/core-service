import { Route } from "../../route/model/routeModel.mjs";
import { Vehicle } from "../../vehicle/model/vehicleModel.mjs";
import { BusOperator } from "../../busOperator/model/busOperatorModel.mjs";

export const permitSchema = {
  permitNumber: {
    notEmpty: {
      errorMessage: "permitNumber is required",
    },
    isString: {
      errorMessage: "permitNumber must be a string",
    },
    isLength: {
      options: { max: 20 },
      errorMessage: "permitNumber must not exceed 20 characters",
    },
    trim: true,
  },
  expiryDate: {
    notEmpty: {
      errorMessage: "expiryDate is required",
    },
    isISO8601: {
      errorMessage: "expiryDate must be a valid ISO 8601 date",
    },
    custom: {
      options: (value, { req }) => {
        const expiryDate = new Date(value);
        const currentDate = new Date();
        if (expiryDate <= currentDate) {
          throw new Error("expiryDate must be later than the today's date");
        }
        return true;
      },
    },
  },
  route: {
    notEmpty: {
      errorMessage: "route is required",
    },
    isNumeric: {
      errorMessage: "route must be a number",
    },
    custom: {
      options: async (value) => {
        const routeExists = await Route.findOne({ routeId: value });
        if (!routeExists) {
          throw new Error("route does not exist in the database");
        }
        return true;
      },
    },
  },
  vehicle: {
    notEmpty: {
      errorMessage: "vehicle is required",
    },
    isNumeric: {
      errorMessage: "vehicle must be a number",
    },
    custom: {
      options: async (value) => {
        const vehicleExists = await Vehicle.findOne({ vehicleId: value });
        if (!vehicleExists) {
          throw new Error("vehicle does not exist in the database");
        }
        return true;
      },
    },
  },
  busOperator: {
    notEmpty: {
      errorMessage: "busOperator is required",
    },
    isNumeric: {
      errorMessage: "busOperator must be a number",
    },
    custom: {
      options: async (value) => {
        const busOperatorExists = await BusOperator.findOne({
          operatorId: value,
        });
        if (!busOperatorExists) {
          throw new Error("busOperator does not exist in the database");
        }
        return true;
      },
    },
  },
};
