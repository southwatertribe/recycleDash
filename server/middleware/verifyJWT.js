//This is to check for jwt for protected routes
const jwt = require('jsonwebtoken')
require('dotenv').config()

//This is to forbid users from acessing specific routes
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) return res.sendStatus(401)
    console.log(authHeader)
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403)
            req.user = decoded.email //might change this to biz id or user id
            next();
        }
    )
}

module.exports = {verifyJWT};