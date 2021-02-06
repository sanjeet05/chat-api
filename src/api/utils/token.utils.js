const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

// redis
const { asyncRedisClient } = require("../../config/redis");

// vars
const { jwtSecret, jwtExpirationInterval, jwtRefreshToken } = require("../../config/vars");

getAccessToken = (user, expiresIn, sesId) => {
  const userId = user._id.toString();
  // access token
  const playload = {
    exp: expiresIn,
    iat: moment().unix(),
    sub: userId,
    phoneNumber: user.phoneNumber,
    isPhoneVerified: user.isPhoneVerified,
    isSocial: user.isSocial,
    sesId: sesId
  };
  const accessToken = jwt.sign(playload, jwtSecret);
  return accessToken;
};

exports.createToken = async user => {
  const tokenType = "Bearer";
  const sesId = uuidv4();
  const expiresIn = moment()
    .add(jwtExpirationInterval, "minutes")
    .unix();

  const userId = user._id.toString();

  const accessToken = getAccessToken(user, expiresIn, sesId);
  const refreshToken = `${userId}!${crypto.randomBytes(40).toString("hex")}`;

  const accessDateInSeconds = parseInt(jwtExpirationInterval) * 60; // minutes into seconds
  const refreshDateInSeconds = parseInt(jwtRefreshToken) * 86400; // days into seconds

  const userSessionKey = "user!session!" + userId + "!" + sesId;
  const userRefSessionKey = "user!ref_session!" + refreshToken;

  try {
    await asyncRedisClient.set(userSessionKey, userId, "EX", accessDateInSeconds);
    await asyncRedisClient.set(userRefSessionKey, userId, "EX", refreshDateInSeconds);
    return { tokenType, accessToken, expiresIn, refreshToken };
  } catch (error) {
    throw new Error("token error");
  }
};
