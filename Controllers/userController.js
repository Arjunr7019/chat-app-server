const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const createToken = (_id) => {
    const jwtKey = process.env.JWT_SECRET_KEY

    return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" })
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password, gender } = req.body;

        let user = await userModel.findOne({ email });

        if (user) return res.status(400).json("Usrer is already present");

        if (!name || !email || !password || !gender) return res.status(400).json("!all input fields are empty");

        if (!validator.isEmail(email)) return res.status(400).json("Not an valid email");

        if (!validator.isStrongPassword(password)) return res.status(400).json("Not strong and valid password");

        user = new userModel({ name, email, password, gender })

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        const token = createToken(user._id);
        res.status(200).json({ _id: user._id, name, email, token });
    } catch (err) {
        res.status(500), json(err);
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await userModel.findOne({ email });

        if (!user) return res.status(400).json("not an registered user");

        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) return res.status(400).json("Inavalid email and password");

        const token = createToken(user._id);
        res.status(200).json({ _id: user._id, name: user.name, email, token });
    } catch (err) {
        res.status(500), json(err);
    }
}

const findUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await userModel.findById(userId).select("-password");
        res.status(200).json(user);
    } catch (err) {
        res.status(500), json(err);
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find().select("-password");
        res.status(200).json(users);
    } catch (err) {
        res.status(500), json(err);
    }
}

module.exports = { registerUser, loginUser, findUser, getUsers }