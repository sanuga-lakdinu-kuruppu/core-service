import { Station } from "../../station/model/stationModel.mjs";

export const routeSchema = {
  routeNumber: {
    notEmpty: {
      errorMessage: "routeNumber cannot be empty",
    },
    isString: {
      errorMessage: "routeNumber must be a string",
    },
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: "routeNumber must not exceed 50 characters",
    },
    trim: true,
  },
  routeName: {
    notEmpty: {
      errorMessage: "routeName cannot be empty",
    },
    isString: {
      errorMessage: "routeName must be a string",
    },
    isLength: {
      options: {
        min: 1,
        max: 50,
      },
      errorMessage: "routeName must be between 1 and 50 characters",
    },
    trim: true,
  },
  travelDistance: {
    optional: true,
    isString: {
      errorMessage: "travelDistance must be a string",
    },
    isLength: {
      options: {
        max: 10,
      },
      errorMessage: "travelDistance must not exceed 10 characters",
    },
    trim: true,
  },
  travelDuration: {
    optional: true,
    isString: {
      errorMessage: "travelDuration must be a string",
    },
    isLength: {
      options: {
        max: 10,
      },
      errorMessage: "travelDuration must not exceed 10 characters",
    },
    trim: true,
  },
  startStationId: {
    notEmpty: {
      errorMessage: "startStationId is required",
    },
    isNumeric: {
      errorMessage: "startStationId should be a number",
    },
    custom: {
      options: async (value, { request }) => {
        const station = await Station.findOne({ stationId: value });
        if (!station) {
          throw new Error("startStationId does not exist in the database");
        }
        return true;
      },
    },
  },
  endStationId: {
    notEmpty: {
      errorMessage: "endStationId is required",
    },
    isNumeric: {
      errorMessage: "endStationId should be a number",
    },
    custom: {
      options: async (value) => {
        const station = await Station.findOne({ stationId: value });
        if (!station) {
          throw new Error("endStationId does not exist in the database");
        }
        return true;
      },
    },
  },
};
