const { Joi } = require("express-validation");
const mongoose = require("mongoose");
const constants = require("../constants");

const vOptions = { statusCode: 422, keyByField: true };

// methods
const validMongoId = (value, helpers) => {
  // Use error to return an existing error code
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("custom_mongo_id_validation");
  }
  // Return the value unchanged
  return value;
};

// variables
const USER_ACTIONS = constants.USER_ACTIONS;

module.exports = {
  vOptions: vOptions,

  // savvy schema
  savvySchema: {
    body: Joi.object({
      savvy: Joi.array().items(Joi.string()).required(),
    }),
  },

  // update password schema
  updatePasswordSchema: {
    body: Joi.object({
      currentPassword: Joi.string().min(8).max(128).required(),
      newPassword: Joi.string().min(8).max(128).required(),
    }),
  },

  // update name
  updateNameSchema: {
    body: Joi.object({
      name: Joi.string().min(2).max(30).required(),
    }),
  },

  // save user actions
  saveUserActionSchema: {
    body: Joi.object({
      feed_id: Joi.string().required().custom(validMongoId, "custom_mongo_id_validation").messages({
        custom_mongo_id_validation: "feed id is invalid",
      }),
      action_type: Joi.string()
        .required()
        .alphanum()
        .valid(...USER_ACTIONS),
    }),
  },

  // get user schema by feed_id
  getUserActionSchema: {
    query: Joi.object({
      feed_id: Joi.string().required().custom(validMongoId, "custom_mongo_id_validation").messages({
        custom_mongo_id_validation: "feed id is invalid",
      }),
    }),
  },

  // get user schema by action_type
  getUserActionSchemaByActionType: {
    query: Joi.object({
      action_type: Joi.string()
        .required()
        .alphanum()
        .valid(...USER_ACTIONS),
    }),
  },

  // GET /v1/users
  // listUsers: {
  //   query: {
  //     page: Joi.number().min(1),
  //     perPage: Joi.number().min(1).max(100),
  //     name: Joi.string(),
  //     email: Joi.string(),
  //     role: Joi.string().valid(User.roles),
  //   },
  // },

  // // POST /v1/users
  // createUser: {
  //   body: {
  //     email: Joi.string().email().required(),
  //     password: Joi.string().min(6).max(128).required(),
  //     name: Joi.string().max(128),
  //     role: Joi.string().valid(User.roles),
  //   },
  // },

  // // PUT /v1/users/:userId
  // replaceUser: {
  //   body: {
  //     email: Joi.string().email().required(),
  //     password: Joi.string().min(6).max(128).required(),
  //     name: Joi.string().max(128),
  //     role: Joi.string().valid(User.roles),
  //   },
  //   params: {
  //     userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
  //   },
  // },

  // // PATCH /v1/users/:userId
  // updateUser: {
  //   body: {
  //     email: Joi.string().email(),
  //     password: Joi.string().min(6).max(128),
  //     name: Joi.string().max(128),
  //     role: Joi.string().valid(User.roles),
  //   },
  //   params: {
  //     userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
  //   },
  // },
};
