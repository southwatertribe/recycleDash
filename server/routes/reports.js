const express = require("express")
const router = express.Router()
const pool = require('../db/dbconnection')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const { timeStamp } = require("console")


// This will get a reports info
// router.get()


//This will create the report
router.post("/:location_rc/:material/generate_shipping_report", async function(req,res){

    //Get material and location
    const material = req.params.material
    const location_rc = req.params.location_rc

    console.log(material)

    //Get date (Should be NOW)
    const date = new Date()

    //Check for the latest shipping report with material and location
    const sqlst = `SELECT * FROM shipping_reports WHERE location_rc = '${location_rc}' AND material = '${material}' ORDER BY timestamp DESC LIMIT 1;`

    //Store latest date
    const [latest] = await pool.query(sqlst)
    console.log(latest)

    if (latest.length === 0) {
        console.log("First Shipping Report")        
    } else {
        console.log("Previous Shipping Report Found")
    }



})

module.exports = router