export const authSchema = {
    username: {
      notEmpty: {
        errorMessage: "username is required",
      },
      isString: {
        errorMessage: "username must be a string",
      },
      isLength: {
        options: {
          max: 50,
        },
        errorMessage: "username must be less than 50 characters",
      },
      trim: true,
    },
    password: {
      notEmpty: {
        errorMessage: "password is required",
      },
      isString: {
        errorMessage: "password must be a string",
      },
      isLength: {
        options: {
          max: 50,
        },
        errorMessage: "password must be less than 50 characters",
      },
      trim: true,
    },
  };
  