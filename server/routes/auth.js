const express = require("express")
const router = express.Router()
const pool = require('../db/dbconnection')
const bcrypt = require('bcrypt')


router.post("/", async function(req,res) {
    const email = req.query.email
    const pwd = req.query.pwd

    const getAuth = `SELECT * FROM users WHERE email='${email}';`

    await pool.query(getAuth).then((result) => {
        console.log(result)
    }).catch((err) => {
        console.log(err)
    });


    res.json("Gucki")


})

module.exports = router