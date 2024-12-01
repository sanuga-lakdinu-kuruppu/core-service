import { Route } from "../../route/model/routeModel.mjs";
import { Station } from "../../station/model/stationModel.mjs";
import { Permit } from "../../permit/model/permitModel.mjs";

export const scheduleSchema = {
  departureTime: {
    notEmpty: {
      errorMessage: "departureTime is required",
    },
    isString: {
      errorMessage: "departureTime must be a string",
    },
    matches: {
      options: [/^[0-2][0-9]:[0-5][0-9]$/],
      errorMessage: "departureTime must follow the format HH:mm",
    },
    trim: true,
    isLength: {
      options: { min: 5, max: 5 },
      errorMessage: "departureTime must be exactly 5 characters long",
    },
  },
  arrivalTime: {
    notEmpty: {
      errorMessage: "arrivalTime is required",
    },
    isString: {
      errorMessage: "arrivalTime must be a string",
    },
    matches: {
      options: [/^[0-2][0-9]:[0-5][0-9]$/],
      errorMessage: "arrivalTime must follow the format HH:mm",
    },
    trim: true,
    isLength: {
      options: { min: 5, max: 5 },
      errorMessage: "arrivalTime must be exactly 5 characters long",
    },
  },
  startLocation: {
    notEmpty: {
      errorMessage: "startLocation is required",
    },
    isNumeric: {
      errorMessage: "startLocation must be a number",
    },
    custom: {
      options: async (value) => {
        const stationExists = await Station.findOne({ stationId: value });
        if (!stationExists) {
          throw new Error("startLocation does not exist in the database");
        }
        return true;
      },
    },
  },
  endLocation: {
    notEmpty: {
      errorMessage: "endLocation is required",
    },
    isNumeric: {
      errorMessage: "endLocation must be a number",
    },
    custom: {
      options: async (value) => {
        const stationExists = await Station.findOne({ stationId: value });
        if (!stationExists) {
          throw new Error("endLocation does not exist in the database");
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
  permit: {
    notEmpty: {
      errorMessage: "permit is required",
    },
    isNumeric: {
      errorMessage: "permit must be a number",
    },
    custom: {
      options: async (value) => {
        const permitExists = await Permit.findOne({ permitId: value });
        if (!permitExists) {
          throw new Error("permit does not exist in the database");
        }
        return true;
      },
    },
  },
};
