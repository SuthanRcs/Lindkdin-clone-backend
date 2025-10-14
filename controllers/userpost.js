const userpost = require("../models/userpost");
const multer = require("multer");
const path = require("path");
const { where } = require("sequelize");


const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage,
    limits: { fieldSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myFile', 2);

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only! (jpeg, jpg, png, gif)');
    }
}

// console.log(storage, "hiiiiiiiiiiiiiiiiii");
// console.log(upload, "helloooooooooooo");

module.exports = {

    createpost: async (req, res) => {

        const {
            id,
            postname,
            content,
            image
        } = req.body

        try {
            const userresult = await userpost.create({
                id,
                postname,
                content,
                image
            })
            res.status(200).json({ success: true, message: "post craeted susccessfully", data: userresult })

        } catch (err) {
            console.log(err, "error to crete or upload post ");
            res.status(500).json({ message: "error to upload or create post " })

        }
    },

    uploads: async (req, res) => {

        upload(req, res, (err) => {

            if (err) {
                console.error(err);
                return res.status(500).json({ error: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ error: 'Please send a file' });
            }

            console.log(req.file);
            res.status(200).json({ message: 'File uploaded successfully!', file: req.file });
        })
    },

    deletepost: async (req, res) => {

        const { id } = req.body;

        try {
            const deletePostResult = await userpost.update({ isActive: 0 }, { where: { id } });
            if (deletePostResult[0] === 0) {
                return res.status(404).json({ message: "Post not found" });
            }

            const updatedPost = await userpost.findOne({ where: { id } });
            res.status(200).json({
                message: "Post deleted successfully",
                data: updatedPost
            });

        } catch (err) {
            console.error(err, "Error deleting post");
            res.status(500).json({ message: "Error deleting post", error: err.message });
        }
    },

    getpostbyid: async (req, res) => {
        const { id } = req.params

        try {
            const getpostresultid = await userpost.findOne({ where: { id } });

            if (getpostresultid[0] == [0]) {
                return res.status(404).json({ message: "post not found" })
            }
            res.status(200).json({ message: "post getched successfully", data: getpostresultid });

        } catch (err) {
            console.log(err,);
            res.status(500).json({ message: "eeror to fech post" })

        }
    },
    getallpost: async (req, res) => {
        try {
            const getallpostresult = await userpost.findAll();
            res.status(200).json({ message: "All post are fetched successfully ", data: getallpostresult })

        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "error to getting all prodcuts " })

        }
    }

}