const express = require("express")
const router = express.Router();
const jwtToken = require("../utils/jwt");
 

const regsiterController = require("../controllers/regsiterCon");

router.post("/login" , regsiterController.loginUser);

router.post("/create-user", regsiterController.createUser);

router.post("/send-email-otp" , regsiterController.EmailOtp);

router.post("/verify-otp" , regsiterController.verifyOtp);

router.get("/get-all-users", jwtToken.authenticateToken, regsiterController.getAllusers);

router.get("/get-user-detailBy/:id", jwtToken.authenticateToken, regsiterController.getuserById);

router.post("/update-user", jwtToken.authenticateToken, regsiterController.updateUser);

router.post("/delete-user/",jwtToken.authenticateToken, regsiterController.deleteUserById);


module.exports = router