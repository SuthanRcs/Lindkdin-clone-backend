const jwt = require("jsonwebtoken");
const crypto = require("crypto")
const genAccessToken = (payload) => {

    const accesstoken = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: "5m" });
    return accesstoken;

}

const requestToken = (payload) => {
    const requestToken = jwt.sign(payload, process.env.REFERSH_TOKEN, { expiresIn: "5d" });
    return requestToken;
}


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // console.log(req.headers, "headersssssssssssss");
    // console.log(authHeader, "authHeaderssssss");
    // console.log(token, "token value");

    if (token == null) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}
function generateSecureOTP(length = 6) {

  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max + 1); 
}



module.exports = { authenticateToken, genAccessToken, requestToken ,generateSecureOTP }