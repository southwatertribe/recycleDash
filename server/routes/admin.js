const express = require("express")
const router = express.Router()
const pool = require('../db/dbconnection')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const verifyJWT = require('../middleware/verifyJWT')

//Testing function during dev
router.get("/tester", async function(req, res) {
    const getter = `SELECT * FROM materials`
    const [getMats] = await pool.query(getter)
    res.json(getMats[1].mat_id)
})


//Admin creates new location
router.post('/:adminID/addLocation', async function (req,res, next) {

    //Get vars
    const bizID = req.query.bizID


    //Begin trasnsaction to add admin
    await pool.beginTransaction();

    
    
    //Insert location
    //Location info
    const locationID = crypto.randomUUID()
    const locationName = req.query.locationName
    sqlst = `INSERT INTO locations(location_id, location_name, business_id) VALUES('${locationID}','${locationName}','${bizID}')`
    pool.query(sqlst)

    //Insert default mats (will be in 4 loop)
    //Location Mats Info 
    //Get all material possibilities
    const getter = `SELECT * FROM materials`
    const [getMats] = await pool.query(getter) 
    
    for (let i = 0; i < getMats.length; i++) {
        const locationmatsID = crypto.randomUUID()
        const currMatID = getMats[i].mat_id
        sqlst = `INSERT INTO locationmats(location_mats_id, location, material) VALUES('${locationmatsID}','${locationID}','${currMatID}');`
        pool.query(sqlst)
    }

    pool.commit()
    res.json(`Added location ${locationName} with ID of ${locationID}`)

    
})

//Admin create employee
router.post('/:adminID/createEmployee', async function(req, res) {

})

//Admin edit location material price
router.put('/:adminID/update/:locationMatID', async function(req, res){
    console.log("TODO, locationmat update")
})


module.exports = router