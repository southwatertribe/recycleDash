const express = require("express")
const router = express.Router()
const pool = require('../db/dbconnection')

router.post("/create-user", async function (req,res) {

    res.json('Creating user account')
})



module.exports = router