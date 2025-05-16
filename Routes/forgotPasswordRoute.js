const express = require("express");
const { SendOtp,VarifyOtp } = require("../Controllers/forgotPasswordController");
const { models } = require("mongoose");

const router = express.Router();

router.get("/:email", SendOtp);
router.post("/verifyOtp", VarifyOtp);

module.exports = router;