const express = require("express")
const router = express.Router()
const pool = require('../db/dbconnection')
const crypto = require('crypto')
const bcrypt = require('bcrypt')


router.post("/:location_rc/material/generate_shipping_report", function(req,res){

    //Get material and location
    const material = req.query.material
    const location_rc = req.query.location_rc


})

module.exports = router