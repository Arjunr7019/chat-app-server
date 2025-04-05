const express = require("express");
const { SendOtp } = require("../Controllers/forgotPasswordController");
const { models } = require("mongoose");

const router = express.Router();

router.post("/", SendOtp);

module.exports = router;