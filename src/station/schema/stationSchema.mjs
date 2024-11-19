export const stationSchema = {
  name: {
    notEmpty: {
      errorMessage: "name cannot by empty",
    },
    isString: {
      errorMessage: "name must be a string",
    },
    isLength: {
      options: {
        min: 1,
        max: 50,
      },
      errorMessage: "name must be between 1 and 50 characters",
    },
    trim: true,
  },
  coordinates: {
    optional: true,
  },
  "coordinates.lat": {
    optional: true,
    isNumeric: {
      errorMessage: "lat must be a number",
    },
    custom: {
      options: (value) => value > -90 && value <= 90,
      errorMessage: "lat must be between -90 and 90",
    },
  },
  "coordinates.log": {
    optional: true,
    isNumeric: {
      errorMessage: "log must be a number",
    },
    custom: {
      options: (value) => value > -180 && value <= 180,
      errorMessage: "log must be between -90 and 90",
    },
  },
};
