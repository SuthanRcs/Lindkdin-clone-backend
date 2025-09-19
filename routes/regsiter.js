const express = require("express")
const router = express.Router();
const jwtToken= require("../utils/jwt");

const regsiterController = require("../controllers/regsiterCon");


router.get("/get-all-Users",regsiterController.getAllusers);
 
router.get("/get-user-detailBy/:id" , regsiterController.getuserById);

router.post("/create-user", regsiterController.createUser);


router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = { email};  

    const accessToken = jwtToken.genAccessToken(user);
    const refreshToken = jwtToken.requestToken(user);

    res.json({
        message: "Login successful",
        accessToken,
        refreshToken
    });
});


router.post("/update-user",jwtToken.authenticateToken, regsiterController.updateUser);


router.delete("/delete-user/:id", regsiterController.deleteUserById);


module.exports = router