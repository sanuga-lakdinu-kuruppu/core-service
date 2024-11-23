export const policySchema = {
  policyName: {
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
  type: {
    notEmpty: {
      errorMessage: "type cannot by empty",
    },
    isString: {
      errorMessage: "type must be a string",
    },
    isLength: {
      options: {
        min: 1,
        max: 20,
      },
      errorMessage: "type must be between 1 and 20 characters",
    },
    trim: true,
  },
  description: {
    optional: true,
    isString: {
      errorMessage: "description must be a string",
    },
    isLength: {
      options: {
        max: 100,
      },
      errorMessage: "description less than 100 characters",
    },
  },
};
