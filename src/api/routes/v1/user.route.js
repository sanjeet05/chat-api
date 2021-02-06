const express = require("express");

// controllers
const controller = require("../../controllers/user.controller");

const router = express.Router();

router.route("/avatars").get(controller.getAvatars).put(controller.makeActiveAvatar);

router.route("/active_avatar").get(controller.getActiveAvatar);

router.route("/messages").get(controller.getMessage).post(controller.saveMessage);

router.route("/reset_config").get(controller.resetConfig);

module.exports = router;
