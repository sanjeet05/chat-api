const lodash = require("lodash");
const jwt = require("jsonwebtoken");

// services
const logger = require("../services/logger.service");
const { jwtSecret } = require("../../config/vars");

// redis
const { asyncRedisClient } = require("../../config/redis");

exports.authorize = () => async (req, res, next) => {
  const token = req.token;
  if (lodash.isEmpty(token)) {
    return res.status(422).json({ error: "token is required" });
  } else {
    try {
      const payload = await jwt.verify(token, jwtSecret);
      if (payload && payload.isSocial) {
        const userSessionKey = "user!session!" + payload.sub + "!" + payload.sesId;
        const userId = await asyncRedisClient.get(userSessionKey);
        if (!userId) {
          return res.status(401).json({ error: "Unauthorised user" });
        }
        req.user = payload;
        return next();
      } else if (payload && payload.isPhoneVerified) {
        // check user session
        const userSessionKey = "user!session!" + payload.sub + "!" + payload.sesId;
        const userId = await asyncRedisClient.get(userSessionKey);
        if (!userId) {
          return res.status(401).json({ error: "Unauthorised user" });
        }
        req.user = payload;
        return next();
      } else {
        res.status(401).json({ error: "Unauthorised user" });
      }
    } catch (error) {
      if (error.name && error.name === "TokenExpiredError") {
        res.status(401).json({ error: "token expired" });
      } else {
        logger.error("unable to get token", error);
        res.status(401).json({ error: "invalid token" });
      }
    }
  }
};
