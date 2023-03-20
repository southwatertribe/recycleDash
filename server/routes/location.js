const express = require("express")
const router = express.Router()
const pool = require('../db/dbconnection')
const crypto = require('crypto')
const bcrypt = require('bcrypt')

//Get all locations based on biz id
router.get("/locations", async function(req, res) {
    console.log("Get all locations by biz id hit!!!!")

    const business_id = req.query.business_id

    const sqlst = `SELECT * FROM locations WHERE business_id='${business_id}';`

    const [locations] = await pool.query(sqlst)
    
    res.json(locations)
    
});

//Get Location Mats by Location ID
router.get("/location-mats/", async function(req,res) {
    const location_id = req.query.location_id
    console.log(location_id)
    const sqlst = `SELECT * FROM locationmats WHERE location='${location_id}';`

    const [location] = await pool.query(sqlst)

    res.json(location)
})

module.exports = router