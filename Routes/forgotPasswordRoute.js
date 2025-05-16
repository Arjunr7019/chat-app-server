const express = require("express");
const { SendOtp,VarifyOtp, UpdateNewPassword } = require("../Controllers/forgotPasswordController");
const { models } = require("mongoose");

const router = express.Router();

router.get("/:email", SendOtp);
router.post("/verifyOtp", VarifyOtp);
router.post("/updateNewPassword", UpdateNewPassword);

module.exports = router;