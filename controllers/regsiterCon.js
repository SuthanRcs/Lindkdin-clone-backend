const { where } = require("sequelize");
const regsiter = require("../models/Register");
const bcrypt = require("bcryptjs");
const jwttokeninRegsiter = require('../utils/jwt')
const crypto = require("crypto");


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
            const newProduct = await regsiter.create({
                id,
                email,
                password: hashedPassword,
                isActive
            })
            res.status(201).json({ success: true, otp: jwttokeninRegsiter.generateSecureOTP(), data: newProduct, message: "Product created successfully" });
        } catch (error) {
            console.error("Error creating product:", error);
            res.status(500).json({ success: false, message: "Failed to create user" });
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