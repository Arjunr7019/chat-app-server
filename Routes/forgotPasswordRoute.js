const express = require("express");
const { SendOtp,VarifyAndUpdateNewPassword } = require("../Controllers/forgotPasswordController");
const { models } = require("mongoose");

const router = express.Router();

router.get("/:email", SendOtp);
router.post("/verifyOtp", VarifyAndUpdateNewPassword);

module.exports = router;