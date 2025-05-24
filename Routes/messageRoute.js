const express = require("express");
const { models } = require("mongoose");
const { createMessage, getMessage,lastMessage } = require("../Controllers/messageController");

const router = express.Router();

router.post("/", createMessage);
router.get("/:chatId", getMessage);
router.get("/lastMessage/:userId", lastMessage);

module.exports = router;