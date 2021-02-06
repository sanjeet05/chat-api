const { Joi } = require("express-validation");
const utils = require("../utils/utils");

const vOptions = { statusCode: 422, keyByField: true };

// methods
const validPhoneNumber = (value, helpers) => {
  // Use error to return an existing error code
  if (utils.isValidPhoneNumber(value)) {
    return helpers.error("custom_phone_validation");
  }
  // Return the value unchanged
  return value;
};

module.exports = {
  vOptions: vOptions,

  // social access token
  accessTokenSchema: {
    body: Joi.object({
      accessToken: Joi.string().required(),
    }),
  },

  // user register schema
  registerOtpSchema: {
    body: Joi.object({
      phoneNumber: Joi.string().required().custom(validPhoneNumber, "custom_phone_validation").messages({
        custom_phone_validation: "phone number is invalid",
      }),
    }),
  },

  registerSchema: {
    body: Joi.object({
      phoneNumber: Joi.string().required().custom(validPhoneNumber, "custom_phone_validation").messages({
        custom_phone_validation: "phone number is invalid",
      }),
      // password: Joi.string().min(8).max(128).required(),
      otp: Joi.string().length(6).required(),
    }),
  },

  // user signin schema
  signinOtpSchema: {
    body: Joi.object({
      phoneNumber: Joi.string().required().custom(validPhoneNumber, "custom_phone_validation").messages({
        custom_phone_validation: "phone number is invalid",
      }),
    }),
  },

  signinSchema: {
    body: Joi.object({
      phoneNumber: Joi.string().required().custom(validPhoneNumber, "custom_phone_validation").messages({
        custom_phone_validation: "phone number is invalid",
      }),
      // password: Joi.string().min(8).max(128).required(),
      otp: Joi.string().length(6).required(),
    }),
  },

  // refresh token schema
  refreshScheme: {
    body: Joi.object({
      refreshToken: Joi.string().required(),
    }),
  },

  // auth code schema
  authCodeSchema: {
    body: Joi.object({
      authCode: Joi.string().length(6).required(),
    }),
  },

  // forgot password schema
  forgotPasswordSchema: {
    body: Joi.object({
      phoneNumber: Joi.string().required().custom(validPhoneNumber, "custom_phone_validation").messages({
        custom_phone_validation: "phone number is invalid",
      }),
    }),
  },

  // change password schema
  changePasswordSchema: {
    body: Joi.object({
      phoneNumber: Joi.string().required().custom(validPhoneNumber, "custom_phone_validation").messages({
        custom_phone_validation: "phone number is invalid",
      }),
      authCode: Joi.string().length(6).required(),
      password: Joi.string().min(8).max(128).required(),
    }),
  },

  // update location
  updateLocationSchema: {
    body: Joi.object({
      latitude: Joi.string().min(2).max(20).required(),
      longitude: Joi.string().min(2).max(20).required(),
    }),
  },
};
