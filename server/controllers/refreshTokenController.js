const jwt = require('jsonwebtoken');
require('dotenv').config();

const handlRefreshToken = (req,res) => {
    const cookies = req.cookies //check cookies
    if (!cookies.jwt) res.status(401) //401 With no cookie/JWT
    console.log(cookies.jwt) //Debug log
    const refresh_token = cookies.jwt //Store refresh token

    const [getAuth] = `SELECT * FROM users WHERE refresh_token='${refresh_token}';` //Get user based on reresh token 
    if (!getAuth) {
        return res.sendStatus(403) //Forbidden if not found
    }
    console.log(getAuth) //Debug log

    jwt.verify(
        refresh_token,
        process.env.RT_SECRET,
        (err, decoded) => {
            if (err || getAuth.user_id !== decoded.email) {
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