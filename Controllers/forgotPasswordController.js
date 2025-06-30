const forgotPassword = require("../Models/forgotPasswordModel");
const userModel = require("../Models/userModel");
const nodemailer = require("nodemailer");
const validator = require("validator");
const bcrypt = require("bcrypt");

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const SendOtp = async (req, res) => {
    const email = req.params.email;

    const user = await userModel.findOne({ email });
    if (user) {
        await forgotPassword.deleteMany({ email });

        const otp = generateOtp();

        const newOtp = new forgotPassword({ email, otp });
        await newOtp.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: {
                name: "Jelly Fish Suport Team",
                address: process.env.EMAIL_USER
            },
            to: email, // list of receivers
            subject: "Password Reset OTP for Your Account", // Subject line
            text: "", // plain text body
            html: `Dear user,<br/><br/>
                We have received a request to reset the password for your account. To ensure the security of your account, please use the following One-Time Password (OTP) to complete the password reset process:<br/><br/>
                OTP: ${otp} <br/><br/>
                Please note that this OTP is valid for a limited time period only(5 mins). If you did not request this password reset, please disregard this email.<br/><br/>
                Thank you for your attention to this matter.<br/><br/>
                Best regards,<br/>
                Jelly Fish Suport Team`
        });
        console.log("Message sent:", info.messageId);
        res.status(200).json("OTP send successfully");
    }else{
        res.status(400).json("user not found. check given email and try again later.");
    }

}

const VerifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const userRecord = await forgotPassword.findOne({ email });

        if (!userRecord) return res.status(404).json({ message: "otp expired! better luck next time." });

        if (userRecord.otp === otp) {
            res.status(200).json("otp is valid");
        } else {
            res.status(400).json("otp is not valid");
        }
    } catch (err) {
        console.error("Error in VerifyAndUpdateNewPassword:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const UpdateNewPassword = async (req, res) => {
    const { email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "user not fount check your email and try again later" });

    if (!validator.isStrongPassword(password)) return res.status(400).json("Not strong and valid password");

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updatedUser = await userModel.findOneAndUpdate(
            { email: email },
            { $set: { password: hashedPassword } },
            { new: true }
        );

        if (!updatedUser) return res.status(400).json("Error updating password");

        res.status(200).json("Password updated successfully.");
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(400).json('Error updating password:', err);
    }
}

module.exports = { SendOtp, VerifyOtp, UpdateNewPassword }