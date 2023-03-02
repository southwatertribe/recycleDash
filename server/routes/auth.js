const express = require("express")
const router = express.Router()
const pool = require('../db/dbconnection')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

//Sign in 
router.post("/", async function(req,res) {
    const email = req.query.email
    const pwd = req.query.pwd

    const getAuth = `SELECT * FROM users WHERE email='${email}';`

    //Return hashed password from db
    const response = await pool.query(getAuth).then((result) => {
        return result[0][0].password
    }).catch((err) => {
        console.log(err)
    });

    //Compare passwords to login 
    const match = await bcrypt.compare(pwd, response)

    //More logic later
    if (match) {
        //Create token
        const accessToken = jwt.sign(
            {"email": email},
            process.env.AT_SECRET,
            {expiresIn: '30s'}
        );
        const refreshToken = jwt.sign(
            {"email": email},
            process.env.RT_SECRET,
            {expiresIn: '90s'}
        );
        res.json("Logged in, send token etc")  

    } else {
        res.json("Incorrect username or password")
    }


})

module.exports = router