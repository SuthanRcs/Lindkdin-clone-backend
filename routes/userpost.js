const express = require("express");
const router = express.Router();

const userpostcontroller = require("../controllers/userpost")


router.post("/create-post" , userpostcontroller.createpost)

router.post("/uploads" ,userpostcontroller.uploads);

router.post("/delete-post" , userpostcontroller.deletepost);

router.post("/getusing-id/:id" , userpostcontroller.getpostbyid)

router.post("/getAll-post" , userpostcontroller.getallpost)



module.exports = router