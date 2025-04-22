const express = require("express");
const { SendOtp } = require("../Controllers/forgotPasswordController");
const { models } = require("mongoose");

const router = express.Router();

router.get("/:email", SendOtp);

module.exports = router;