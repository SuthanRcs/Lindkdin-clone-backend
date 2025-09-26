const express = require("express")
const router = express.Router();
const jwtToken = require("../utils/jwt");

const regsiterController = require("../controllers/regsiterCon");



router.post("/create-user", regsiterController.createUser);


router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = { email };

    const accessToken = jwtToken.genAccessToken(user);
    const refreshToken = jwtToken.requestToken(user);

    res.cookie("refreshToken", refreshToken, { maxAge: "", httpOnly: true })

    res.json({
        message: "Login successful",
        accessToken,
        // refreshToken
    });
});


router.get("/get-all-users", jwtToken.authenticateToken, regsiterController.getAllusers);

router.get("/get-user-detailBy/:id", jwtToken.authenticateToken, regsiterController.getuserById);

router.post("/update-user", jwtToken.authenticateToken, regsiterController.updateUser);

router.post("/delete-user/", regsiterController.deleteUserById);


module.exports = router