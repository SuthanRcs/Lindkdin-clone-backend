const { where } = require("sequelize");
const regsiter = require("../models/register");
const bcrypt = require("bcryptjs");
const jwttokeninRegsiter = require('../utils/jwt')
const crypto = require("crypto");


const otpCache = {};

const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: "suthanmsd07@gmail.com",
        pass: process.env.APP_PASSWORD

    }
})

module.exports = {

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


    createUser: async (req, res) => {
        const {
            id,
            email,
            password,
            isActive
        } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            // const otp = jwttokeninRegsiter.generateSecureOTP();
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
                otpExpiry: Date.now() + 5 * 60 * 1000
            }
            console.log(otpCache, "otp caheceeeeeeeee");

            const info = await transporter.sendMail({
                to: email,
                subject: "Your Linkdin Regsiter OTP",
                html:
                    `<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2 style="color: #333;">Your OTP Code</h2>
            <p style="font-size: 16px; color: #555;">Please use the following OTP to verify your account:</p>
            <h1 style="font-size: 48px; color: #1a73e8; margin: 20px 0;">${otpemail}</h1>
            <p style="font-size: 14px; color: #888;">This OTP will expire in 5 minutes.</p>
        </div>`
            });

            console.log("Email sended:");
            return res.status(200).json({ success: true, otp: otpemail, message: "Email sent successfully" });
        } catch (err) {
            console.error("Error sending email:", err.message);
            return res.status(500).json({ success: false, message: "Failed to send email" });
        }

    },
    verifyOtp: async (req, res) => {
        try {
            const { email, otp } = req.body;
            const emailKey = email.trim().toLowerCase();
            const cachedOtp = otpCache[emailKey];
            console.log(cachedOtp, "cache checkkkkkkk");

            if (!cachedOtp) {
                return res.status(404).json({ success: false, message: "No OTP found for this email" });
            }

            if (Date.now() > cachedOtp.otpExpiry) {
                delete otpCache[emailKey];
                return res.status(400).json({ success: false, message: "OTP expired" });
            }

              if (String(cachedOtp.otp) != String(otp)) {
                return res.status(400).json({ success: false, message: "Invalid OTP" });
            }
                        console.log("sss", String(cachedOtp.otp), String(otp), "otppppppppp");

            return res.status(200).json({ success: true, message: "OTP verified successfully" });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Server error" });
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


