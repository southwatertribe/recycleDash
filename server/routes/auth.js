const express = require("express")
const router = express.Router()
const pool = require('../db/dbconnection')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

//Sign in 
//Importan, both employee and admin id will be converted to user id
router.post("/admin-auth", async function(req,res) {
    const email = req.body.email
    const password = req.body.password
    const getAuth = `SELECT * FROM admins WHERE email='${email}';`
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
    const match = await bcrypt.compare(password, response.password)
    //More logic later
    if (match) {
        //Create token and store the userID in it
        const user_id = response.user_id
        const business_id = response.business
        const role = response.role
        const accessToken = jwt.sign(
            {"user_id": user_id, "business_id": response.business_id},
            process.env.AT_SECRET,
            {expiresIn: '300s'}
        );
        const refreshToken = jwt.sign(
            {"user_id": user_id, "business_id": response.business_id},
            process.env.RT_SECRET,
            {expiresIn: '1d'}
        );
        
        console.log("Refresh token from auth is: ")
        console.log(refreshToken)
        const RFToken = `UPDATE admins SET refresh_token='${refreshToken}' WHERE user_id='${user_id}'`
        
        //Store refresh token into admins database 
        pool.query(RFToken)
       

        res.cookie('jwt', refreshToken, {httpOnly: false, maxAge: 24 * 60 * 60 * 1000})
        res.json({
            "user_id": user_id,
            "role": role, //This will determine which dash to render
            "business_id": business_id,
            "access_token": accessToken
        })  

    } else {
        res.json("Incorrect username or password")
    }


})


router.post("/emp-auth", async function(req,res) {
    const user_name = req.body.user_name
    const password = req.body.password
    const getAuth = `SELECT * FROM employees WHERE user_name='${user_name}';`
    //Return hashed password from db
    const response = await pool.query(getAuth).then((result) => {
        console.log("this")
        console.log(result[0][0])
        return result[0][0]
    }).catch((err) => {
        console.log(err)
    });

    //Compare passwords to login 
    const match = await bcrypt.compare(password, response.password)

    //More logic later
    if (match) {
        console.log("MATCHED")
        //Create token and store the userID in it
        const user_id = response.user_id
        const business = response.business
        const role = response.role
        const curr_location = response.curr_location
        const accessToken = jwt.sign(
            {
                "user_id": user_id, 
                "business": response.business, 
                "username": response.user_name,
                "f_name": response.f_name,
                "l_name": response.l_name
            },
            process.env.AT_SECRET,
            {expiresIn: '300s'}
        );
        const refreshToken = jwt.sign(
            {
                "user_id": user_id, 
                "business": response.business, 
                "username": response.user_name,
                "f_name": response.f_name,
                "l_name": response.l_name
            },
            process.env.RT_SECRET,
            {expiresIn: '1d'}
        );
        
        console.log("Refresh token from auth is: ")
        console.log(refreshToken)
        const RFToken = `UPDATE employees SET refresh_token='${refreshToken}' WHERE user_id='${user_id}'`
        
        //Store refresh token into admins database 
        pool.query(RFToken)
       

        res.cookie('jwt', refreshToken, {httpOnly: false, maxAge: 24 * 60 * 60 * 1000})
        res.json({
            "user_id": user_id,
            "role": role, //This will determine which dash to render
            "business": business,
            "curr_location": curr_location,
            "username": user_name,
            "f_name": response.f_name,
            "l_name": response.l_name,
            "access_token": accessToken
        })  

    } else {
        res.json("Incorrect username or password")
    }
    

})
module.exports = router