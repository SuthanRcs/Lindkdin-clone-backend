const { where } = require("sequelize");
const regsiter = require("../models/Register");
const bcrypt = require("bcryptjs");
// const { genAccessToken, authenticateToken } = require("../utils/jwt");
const jwttokeninRegsiter = require('../utils/jwt')

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
            // const token = jwttokeninRegsiter.genAccessToken({ email: email });
            res.status(201).json({ success: true, data: newProduct, message: "Product created successfully" });
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
            const udpateusers = await regsiter.update({
                id,
                email,
                password,
                isActive

            }, {
                where: { id }
            });
            res.status(201).json({ data: udpateusers, message: "user update succesffuly" })
        }
        catch (error) {
            console.error("Error to user:", error);
            res.status(500).json({ message: "Failed to update user" });
        }

    },
    deleteUserById: async (req, res) => {
        const { id } = req.params
        console.log(id, ".......");

        try {
            const deleteUser = await regsiter.destroy({ where: { id } });
            res.status(200).json({ success: true, data: deleteUser });
        } catch (error) {
            console.log("error.", error);
            res.status(500).json({ success: false, message: "Failed to delete user" });
        }
    },

}