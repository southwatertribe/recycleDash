const jwt = require('jsonwebtoken');
require('dotenv').config();
const pool = require('../db/dbconnection')

const handlRefreshToken = async (req,res) => {
    const cookies = req.cookies
    console.log("COOKIE CHECK TOKEN CONTROLLER") //check cookies
    if (!cookies.jwt) res.status(401) //401 With no cookie/JWT
    console.log("Refresh controller line: 7")
    console.log(cookies.jwt) //Debug log
    const refresh_token = cookies.jwt //Store refresh token
    
    const sqlst = `SELECT * FROM users WHERE refresh_token="${refresh_token}";` //Get user based on reresh token 
    const [getAuth] = await pool.query(sqlst)
    console.log("Line 14")
    console.log(getAuth)
    if (!getAuth) {
        console.log("Faillll")
        return res.sendStatus(403) //Forbidden if not found
    }
    

    jwt.verify(
        refresh_token,
        process.env.RT_SECRET,
        (err, decoded) => {
            if (err || getAuth[0].user_id !== decoded.user_id) {
                console.log(getAuth[0].user_id)
                console.log("Decoded")
                console.log(decoded.user_id)
                console.log(err)
                return res.sendStatus(403);
            }

            const accessToken = jwt.sign(
                {"user_id": getAuth.user_id},
                process.env.AT_SECRET,
                {expiresIn: '30s'}
            );

            res.json({accessToken})
        }
    )
}

module.exports = { handlRefreshToken }