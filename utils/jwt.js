const jwt = require("jsonwebtoken");

const genAccessToken = (payload) => {

    const accesstoken = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: "5m" });
    return accesstoken;

}

const requestToken = (payload) => {
    const requestToken = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, { expiresIn: "10h" });
    return requestToken;
}


function authenticateToken(req, res, next) {

    const authHeader = req.headers['Authorization']

    const token = authHeader && authHeader.split('')[1]

    if (token == null) return res.status(401)

    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, user) => {
        if (err) {
            res.sendStatus(403)
            req.user = user;
            next()

        }
    })

}


module.exports = { authenticateToken, genAccessToken, requestToken }