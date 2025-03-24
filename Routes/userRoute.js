const express = require("express");
const { registerUser, loginUser, findUser, getUsers,findUserByEmail } = require("../Controllers/userController")

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/findfriend/:email", findUserByEmail);
router.get("/", getUsers);

module.exports = router; 