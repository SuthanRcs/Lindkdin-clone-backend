const express = require("express")
const router = express.Router();
const jwtToken = require("../utils/jwt");
 
const passport = require("passport");
require("../middleweres/auth");

const regsiterController = require("../controllers/regsiterCon");

router.post("/login" , regsiterController.loginUser);

router.post("/refresh-token" , regsiterController.refreshTokenUser)

router.post ("/requestPasswordReset" , regsiterController.requestToEmail);

router.post ("/reset-password" , regsiterController.resetforpassword);

router.get("/goole/callback" , regsiterController.checkauth)

router.post("/create-user", regsiterController.createUser);

router.post("/send-email-otp" , regsiterController.EmailOtp);

router.post("/verify-otp" , regsiterController.verifyOtp);

router.get("/get-all-users", jwtToken.authenticateToken, regsiterController.getAllusers);

router.get("/get-user-detailBy/:id", jwtToken.authenticateToken, regsiterController.getuserById);

router.post("/update-user", jwtToken.authenticateToken, regsiterController.updateUser);

router.post("/delete-user/",jwtToken.authenticateToken, regsiterController.deleteUserById);


//google setup 
router.get("/google",passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",passport.authenticate("google", { failureRedirect: "/login/google/failed" }),(req, res) => {
    // Here you can issue your own JWT if you want
    const token = jwtToken.generateToken(req.user.id);

    res.json({
      message: "Google login success",
      user: req.user,
      token: token,
    });
  }
);

router.get("/google/failed", (req, res) => {
  res.status(401).json({ message: "Google login failed" });
});


module.exports = router