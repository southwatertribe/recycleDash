const express = require("express")
const router = express.Router()
const pool = require('../db/dbconnection')
const crypto = require('crypto')
const bcrypt = require('bcrypt')

//Get all locations
router.get("/locations", async function(req, res) {
    const business = req.query.biz_id

    const sqlst = `SELECT * FROM locations WHERE business_id='${business}';`

    const [locations] = await pool.query(sqlst)

    res.json(locations)
});

module.exports = router