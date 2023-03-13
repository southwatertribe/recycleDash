//This is to check for jwt for protected routes
const jwt = require('jsonwebtoken')
require('dotenv').config()

//This is to forbid users from acessing specific routes
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) return res.sendStatus(401)
    console.log("before:::")
    console.log(authHeader)
    const token = authHeader.split(' ')[1];
    console.log(token)
    jwt.verify(
        token,
        process.env.AT_SECRET,
        (err, decoded) => {
            if (err) return res.send(err)
            req.user = decoded.user_id //might change this to biz id or user id
            next();
        }
    )
}

module.exports = {verifyJWT};