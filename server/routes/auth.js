const express = require("express")
const router = express.Router()
const pool = require('../db/dbconnection')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

//Sign in 
router.post("/", async function(req,res) {
    const email = req.body.email
    const pwd = req.body.password
    const getAuth = `SELECT * FROM users WHERE email='${email}';`
    console.log(email)
    //Return hashed password from db
    const response = await pool.query(getAuth).then((result) => {
        console.log("this")
        console.log(result[0][0])
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
        const business_id = response.business_id
        const accessToken = jwt.sign(
            {"user_id": userID, "business_id": response.business_id},
            process.env.AT_SECRET,
            {expiresIn: '10s'}
        );
        const refreshToken = jwt.sign(
            {"user_id": userID, "business_id": response.business_id},
            process.env.RT_SECRET,
            {expiresIn: '1d'}
        );
        
        console.log("Refresh token from auth is: ")
        console.log(refreshToken)
        const RFToken = `UPDATE users SET refresh_token='${refreshToken}' WHERE user_id='${response.user_id}'`
        
        //Store refresh token into users database 
        pool.query(RFToken)
        const rolest = `SELECT * FROM user_roles WHERE user_id='${userID}'`;
        const [role] = await pool.query(rolest)

        res.cookie('jwt', refreshToken, {httpOnly: false, maxAge: 24 * 60 * 60 * 1000})
        res.json({
            "user_id": userID,
            "role": role[0].role_id, //This will determine which dash to render
            "business_id": business_id,
            "access_token": accessToken
        })  

    } else {
        res.json("Incorrect username or password")
    }


})

module.exports = router