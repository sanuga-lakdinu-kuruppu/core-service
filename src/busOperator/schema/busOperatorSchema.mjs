import { BusOperator } from "../model/busOperatorModel.mjs";

export const busOperatorSchema = {
  "name.firstName": {
    notEmpty: {
      errorMessage: "firstName cannot be empty",
    },
    isString: {
      errorMessage: "firstName must be a string",
    },
    isLength: {
      options: {
        min: 1,
        max: 20,
      },
      errorMessage: "firstName must be between 1 and 20 characters",
    },
    trim: true,
  },
  "name.lastName": {
    notEmpty: {
      errorMessage: "lastName cannot be empty",
    },
    isString: {
      errorMessage: "lastName must be a string",
    },
    isLength: {
      options: {
        min: 1,
        max: 20,
      },
      errorMessage: "lastName must be between 1 and 20 characters",
    },
    trim: true,
  },
  company: {
    notEmpty: {
      errorMessage: "company cannot be empty",
    },
    isString: {
      errorMessage: "company must be a string",
    },
    isLength: {
      options: {
        min: 1,
        max: 50,
      },
      errorMessage: "company must be between 5 and 50 characters",
    },
    trim: true,
  },
  "contact.mobile": {
    notEmpty: {
      errorMessage: "mobile cannot be empty",
    },
    isString: {
      errorMessage: "mobile must be a string",
    },
    matches: {
      options: [/^\+94\d{9}$/],
      errorMessage:
        "mobile must be a valid Sri Lankan mobile number starting with +94 followed by 9 digits",
    },
    trim: true,
  },
  "contact.email": {
    notEmpty: {
      errorMessage: "email cannot be empty",
    },
    isString: {
      errorMessage: "email must be a string",
    },
    isLength: {
      options: {
        min: 10,
        max: 100,
      },
      errorMessage: "email must be between 10 and 100 characters",
    },
    isEmail: {
      errorMessage: "email must be a valid email address",
    },
    trim: true,
  },
  "contact.address.no": {
    optional: true,
    isString: {
      errorMessage: "no must be a string",
    },
    isLength: {
      options: {
        min: 1,
        max: 10,
      },
      errorMessage: "no must be between 1 and 10 characters",
    },
    trim: true,
  },
  "contact.address.street1": {
    notEmpty: {
      errorMessage: "street1 cannot be empty",
    },
    isString: {
      errorMessage: "street1 must be a string",
    },
    isLength: {
      options: {
        min: 1,
        max: 50,
      },
      errorMessage: "street1 must be between 1 and 50 characters",
    },
    trim: true,
  },
  "contact.address.street2": {
    optional: true,
    isString: {
      errorMessage: "street2 must be a string",
    },
    isLength: {
      options: {
        min: 1,
        max: 50,
      },
      errorMessage: "street2 must be between 1 and 50 characters",
    },
    trim: true,
  },
  "contact.address.street3": {
    optional: true,
    isString: {
      errorMessage: "street3 must be a string",
    },
    isLength: {
      options: {
        min: 1,
        max: 50,
      },
      errorMessage: "street3 must be between 1 and 50 characters",
    },
    trim: true,
  },
  "contact.address.city": {
    notEmpty: {
      errorMessage: "city cannot be empty",
    },
    isString: {
      errorMessage: "city must be a string",
    },
    isLength: {
      options: {
        min: 1,
        max: 50,
      },
      errorMessage: "city must be between 1 and 50 characters",
    },
    trim: true,
  },
  "contact.address.district": {
    notEmpty: {
      errorMessage: "district cannot be empty",
    },
    isString: {
      errorMessage: "district must be a string",
    },
    isLength: {
      options: {
        min: 1,
        max: 20,
      },
      errorMessage: "district must be between 1 and 20 characters",
    },
    trim: true,
  },
  "contact.address.province": {
    notEmpty: {
      errorMessage: "province cannot be empty",
    },
    isString: {
      errorMessage: "province must be a string",
    },
    isLength: {
      options: {
        min: 1,
        max: 20,
      },
      errorMessage: "province must be between 1 and 20 characters",
    },
    trim: true,
  },
};
