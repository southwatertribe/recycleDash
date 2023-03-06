const express = require("express")
const router = express.Router()
const pool = require('../db/dbconnection')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

//Sign in 
router.post("/", async function(req,res) {
    console.log(req.body.email)
    const email = req.body.email
    const pwd = req.body.password
    console.log(`pass is ${pwd}`)
    const getAuth = `SELECT * FROM users WHERE email='${email}';`

    //Return hashed password from db
    const response = await pool.query(getAuth).then((result) => {
        console.log(result[0][0].password)
        return result[0][0]
    }).catch((err) => {
        console.log(err)
    });

    //Compare passwords to login 
    const match = await bcrypt.compare(pwd, response.password)

    //More logic later
    if (match) {
        //Create token and store the userID in it
        const userID = response.user_id
        const accessToken = jwt.sign(
            {"user_id": userID},
            process.env.AT_SECRET,
            {expiresIn: '30s'}
        );
        const refreshToken = jwt.sign(
            {"user_id": userID},
            process.env.RT_SECRET,
            {expiresIn: '1d'}
        );
        
        const RFToken = `UPDATE users SET refresh_token='${refreshToken}' WHERE user_id='${response.user_id}'`
        
        //Store refresh token into users database 
        pool.query(RFToken)
        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
        res.json({
            "user_id": userID,
            "access_token": accessToken
        })  

    } else {
        res.json("Incorrect username or password")
    }


})

module.exports = router