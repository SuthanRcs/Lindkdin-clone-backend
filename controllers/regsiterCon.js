const { where } = require("sequelize");
const regsiter = require("../models/Register");
const bcrypt = require("bcryptjs");
const jwttokeninRegsiter = require('../utils/jwt')
const crypto = require("crypto");
const jwt = require("jsonwebtoken");


const otpCache = {};

const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD

    }
})

module.exports = {

    checkauth: async (req, res) => {
        res.send("add extra url for these wrong sttsus api credintals ")
    },

    createUser: async (req, res) => {
        const {
            id,
            email,
            password,
            isActive
        } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await regsiter.create({
                id,
                email,
                password: hashedPassword,
                isActive
            })
            res.status(201).json({ success: true, data: { newUser }, message: "Product created successfully" });
        } catch (error) {
            console.error("Error creating product:", error);
            res.status(500).json({ success: false, message: "Failed to create user" });
        }
    },

    EmailOtp: async (req, res) => {
        const otpemail = jwttokeninRegsiter.generateSecureOTP();
        const { email } = req.body

        try {
            const emailKey = email.trim().toLowerCase();
            otpCache[emailKey] = {
                otp: otpemail,
                otpExpiry: Date.now() + 10 * 60 * 1000
            }
            // console.log(otpCache, "otp caheceeeeeeeee");

            const info = await transporter.sendMail({
                to: email,
                subject: "Your Linkdin Regsiter OTP",
                html:
                    `<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2 style="color: #333;">Your OTP Code</h2>
            <p style="font-size: 16px; color: #555;">Please use the following OTP to verify your account:</p>
            <h1 style="font-size: 48px; color: #1a73e8; margin: 20px 0;">${otpemail}</h1>
            <p style="font-size: 14px; color: #888;">This OTP will expire in 10 minutes.</p>
        </div>`
            });

            return res.status(200).json({ success: true, message: "Email sent successfully" });
        } catch (err) {
            console.error("Error sending email:", err.message);
            return res.status(500).json({ success: false, message: "Failed to send email" });
        }

    },
    verifyOtp: async (req, res) => {
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                return res.status(400).json({ success: false, message: "Email and OTP are required" });
            }

            const emailKey = email.trim().toLowerCase();
            const cachedOtp = otpCache[emailKey];

            if (!cachedOtp) {
                return res.status(404).json({ success: false, message: "No OTP found for this email" });
            }

            if (Date.now() > cachedOtp.otpExpiry) {
                delete otpCache[emailKey];
                return res.status(400).json({ success: false, message: "OTP expired" });
            }

            if (String(cachedOtp.otp) !== String(otp)) {
                return res.status(400).json({ success: false, message: "Invalid OTP" });
            }

            return res.status(200).json({ success: true, message: "OTP verified successfully" });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    },

    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Email and password required" });
            }

            const user = await regsiter.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Invalid email or password" });

            }
            const payload = { email: user.email };
            const accessToken = jwttokeninRegsiter.genAccessToken(payload);
            const refreshToken = jwttokeninRegsiter.requestToken(payload);


            //saved in cookie 

            res.cookie("refreshToken", refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                httpOnly: true
            });

            return res.status(200).json({
                user: { email: user.email, password: user.password },
                message: "Login successful",
                success: true,
                accessToken,
            });

        } catch (err) {
            console.error("Login error:", err);
            res.status(500).json({ message: "Server error" });
        }
    },

    requestToEmail: async (req, res) => {
        const { email } = req.body
        try {
            const OtpforPasswordRequest = jwttokeninRegsiter.generateSecureOTP()

            const emailKeyforpassword = email.trim().toLowerCase();

            otpCache[emailKeyforpassword] = {
                otp: OtpforPasswordRequest,
                otpExpiry: Date.now() + 10 * 60 * 1000
            }
            const userforRequest = await regsiter.findOne({
                where: { email: emailKeyforpassword }
            });
            if (!userforRequest) {
                return res.status(401).json({ message: "user does not exit" })
            }
            // const secret = process.env.ACCESS_SECRET_KEY + userforRequest.password;
            // const token = jwt.sign({ id: userforRequest._id, email: userforRequest.email }, secret, { expiresIn: '1h' });

            const mailOptionstoPasswordRequest = {
                to: userforRequest.email,
                from: process.env.APP_EMAIL,
                subject: 'Password Reset Request',
                html: ` <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; padding: 30px; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #222; text-align: center; font-size: 24px; margin-bottom: 15px;">Reset Your Password</h2>

        <p style="color: #444; font-size: 17px; line-height: 1.6;">
          Hello, <br><br>
          You recently requested to <b>reset your password</b>. Please use the following
          <b>OTP (One-Time Password)</b> to complete the process:
        </p>

        <div style="text-align: center; margin: 35px 0;">
          <span style="display: inline-block; background-color: #007bff; color: white; font-size: 24px; font-weight: bold; letter-spacing: 3px; padding: 12px 28px; border-radius: 8px;">
            ${OtpforPasswordRequest}
          </span>
        </div>

        <p style="color: #444; font-size: 17px; line-height: 1.6;">
          <b>Note:</b> This OTP is valid for <b>10 minutes</b>. If you did not request a password reset, please ignore this email — your password will remain unchanged.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;"> </div> </div>`};

            await transporter.sendMail(mailOptionstoPasswordRequest);
            res.status(200).json({ success: true, message: 'Password reset OTP sent successfully' });


        } catch (err) {
            console.log(err, "error to request to you mail ");
            res.status(500).json({ message: 'Something went wrong' })

        }

    },

    resetforpassword: async (req, res) => {

        const { email, otp, password } = req.body;
        try {
            if (!email || !otp || !password) {
                return res.status(400).json({ message: "Email, OTP, and password are required" });
            }

            const emailKeyforpassword = email.trim().toLowerCase();

            //acutllay thisinside otp have inside 
            const cached = otpCache[emailKeyforpassword];

            if (!cached) {
                return res.status(400).json({ message: "OTP not found. Please request a new one." });
            }

            if (otp !== String(cached.otp)) {
                return res.status(400).json({ message: "Invalid OTP" });
            }
            if (cached.otpExpiry < Date.now()) {
                return res.status(400).json({ message: "OTP expired" });
            }
            //validtions above 
            const user = await regsiter.findOne({ where: { email: emailKeyforpassword } });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            user.password = hashedPassword;
            await user.save();

            const result = await regsiter.update(
                { password: hashedPassword },
                { where: { email: emailKeyforpassword } }
            );

            delete otpCache[emailKeyforpassword];
            res.status(200).json({ message: "Password has been reset successfully" });

        } catch (error) {
            console.error("Error resetting password with OTP:", error);
            res.status(500).json({ message: "Something went wrong" });
        }

    },

    getAllusers: async (req, res) => {

        try {
            const getallusers = await regsiter.findAll();
            res.status(200).json({ data: getallusers })
        }
        catch (error) {
            console.log("error", error);
            res.status(500).json({ message: "failed to get all users" })
        }

    },

    getuserById: async (req, res) => {
        const { id } = req.params
        console.log("ID from params:", id);
        try {
            const userid = await regsiter.findOne({ where: { id } });
            if (!userid) {
                res.status(401).json({ message: "user not found" })

            }
            res.status(200).json({ data: userid });
        } catch (error) {
            console.log("error", error);
            res.status(500).json({ message: "Failed to retrieve user detial" });
        }
    },

    updateUser: async (req, res) => {
        const {
            id,
            email,
            password,
            isActive

        } = req.body

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const udpateusers = await regsiter.update({
                id,
                email,
                password: hashedPassword,
                isActive

            }, {
                where: { id }
            });
            const updatedUser = await regsiter.findOne({ where: { id } })
            res.status(201).json({ message: "user update succesffuly", updateduser: updatedUser })
        }
        catch (error) {
            console.error("Error to user:", error);
            res.status(500).json({ message: "Failed to update user" });
        }

    },

    deleteUserById: async (req, res) => {
        const { id } = req.body
        try {
            const deleteResult = await regsiter.update({ isActive: 0 }, { where: { id } })
            const updatedDeletedUser = await regsiter.findOne({ where: { id } });

            if (deleteResult[0] == 0) {
                return res.status(404).status({ message: "user not found" })
            }
            res.status(200).json({ message: 'Record marked as inactive', deletedUser: updatedDeletedUser });

        }
        catch (err) {
            res.status(500).json({ message: "error to deleet user " + err.message })

        }
    }

}


