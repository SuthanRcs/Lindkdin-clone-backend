const { where } = require("sequelize");
const regsiter = require("../models/Register")


module.exports = {

    createUser: async (req, res) => {
        const {
            id,
            email,
            password,
            isActive
        } = req.body;

        try {
            const newProduct = await regsiter.create({
                id,
                email,
                password,
                isActive
            })

            res.status(201).json({ success: true, otp: "2333", data: newProduct, message: "Product created successfully" });
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
        try {
            const regsiter = await regsiter.destroy({ where: { id } });
            res.status(200).json({ success: true, data: regsiter });
        } catch (error) {
            console.log("error.", error);
            res.status(500).json({ success: false, message: "Failed to delete user" });
        }
    },

}