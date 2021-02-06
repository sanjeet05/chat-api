const { v4: uuidv4 } = require("uuid");

// service
const logger = require("../services/logger.service");

// redis
const { asyncRedisClient } = require("../../config/redis");

// constants
const { AVATARS } = require("../constants");

// reset config
exports.resetConfig = async (req, res) => {
  const userAvatarKey = "user!avatars";
  const userMessageKey = "user!messages";
  const userSessionKey = "user!session!active";
  try {
    // reset avatars
    await asyncRedisClient.del(userAvatarKey);
    // reset message
    await asyncRedisClient.del(userMessageKey);
    // reset session
    await asyncRedisClient.del(userSessionKey);
    logger.info("config reseted");
    return res.status(200).json({ message: "config reseted" });
  } catch (error) {
    logger.error("unable to reset config", error);
    res.status(400).json({ error: "unable to reset config" });
  }
};

// get avatars
exports.getAvatars = async (req, res) => {
  const userAvatarKey = "user!avatars";
  try {
    const avatars = await asyncRedisClient.get(userAvatarKey);
    if (avatars) {
      logger.info("avatars already exists");
      return res.status(200).json(JSON.parse(avatars));
    } else {
      // create and send it
      await asyncRedisClient.set(userAvatarKey, JSON.stringify(AVATARS));
      logger.info("created new avatars");
      return res.status(200).json(AVATARS);
    }
  } catch (error) {
    logger.error("unable to get avatars", error);
    res.status(400).json({ error: "unable to get avatars" });
  }
};

exports.getActiveAvatar = async (req, res) => {
  const userSessionKey = "user!session!active";
  logger.info("userSessionKey: %s", userSessionKey);
  try {
    let avatar = await asyncRedisClient.get(userSessionKey);
    if (!avatar) {
      return res.status(200).json(avatar);
    }
    avatar = JSON.parse(avatar);
    return res.status(200).json(avatar);
  } catch (error) {
    logger.error("unable to update session", error);
    res.status(400).json({ error: "unable to update session" });
  }
};

// make an active
exports.makeActiveAvatar = async (req, res) => {
  const { id, socketId } = req.body;
  const userAvatarKey = "user!avatars";
  const userSessionKey = "user!session!active";

  try {
    let avatars = await asyncRedisClient.get(userAvatarKey);
    if (!avatars) {
      return res.status(403).json({ error: "avatars does not exists" });
    }
    avatars = JSON.parse(avatars);

    const foundAvatar = avatars.find((item) => item.id == id);
    if (foundAvatar) {
      foundAvatar.session_id = socketId;
      // update avatars
      await asyncRedisClient.set(userSessionKey, JSON.stringify(foundAvatar));
      logger.info("updated a session");
      return res.status(200).json(foundAvatar);
    } else {
      return res.status(403).json({ error: "avatar not found" });
    }
  } catch (error) {
    logger.error("unable to update session", error);
    res.status(400).json({ error: "unable to update session" });
  }
};

// save message
exports.saveMessage = async (req, res) => {
  const { id, message } = req.body;

  const userAvatarKey = "user!avatars";
  const userMessageKey = "user!messages";

  try {
    // vaidate avator
    let avatars = await asyncRedisClient.get(userAvatarKey);
    if (!avatars) {
      return res.status(403).json({ error: "avatars does not exists" });
    }
    avatars = JSON.parse(avatars);
    const foundAvatar = avatars.find((item) => item.id == id);

    let newMessage = {
      id: uuidv4(),
      avatar: { id: foundAvatar.id, image_url: foundAvatar.image_url },
      message: message,
      timestamp: new Date(),
    };

    let messages = await asyncRedisClient.get(userMessageKey);
    if (!messages) {
      // first time
      messages = [];
      messages.push(newMessage);
      await asyncRedisClient.set(userMessageKey, JSON.stringify(messages));
      io.sockets.emit("subscribeToRoom", newMessage);
      return res.status(200).json(messages);
    } else {
      messages = JSON.parse(messages);
      // messages.unshift(newMessage);
      messages.push(newMessage);
      // update message
      await asyncRedisClient.set(userMessageKey, JSON.stringify(messages));

      io.sockets.emit("subscribeToRoom", newMessage);

      return res.status(200).json(messages);
    }
  } catch (error) {
    logger.error("unable to save a message", error);
    res.status(400).json({ error: "unable to save a message" });
  }
};

// get message
exports.getMessage = async (req, res) => {
  const userMessageKey = "user!messages";
  try {
    let messages = await asyncRedisClient.get(userMessageKey);
    if (!messages) {
      messages = [];
      return res.status(200).json(messages);
    } else {
      messages = JSON.parse(messages);
      return res.status(200).json(messages);
    }
  } catch (error) {
    logger.error("unable to get messages", error);
    res.status(400).json({ error: "unable to get messages" });
  }
};
