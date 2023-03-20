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
router.post('/addLocation', async function (req,res, next) {

    //Get vars
    const business_id = req.query.business_id
    const location_rc_number = req.query.location_rc_number
    const location_name = req.query.location_name
    //Begin trasnsaction to add admin
    await pool.beginTransaction();
    
    //Insert location
    
    sqlst = `INSERT INTO locations(location_rc_number, location_name, business_id) VALUES('${location_rc_number}','${location_name}','${business_id}')`
    pool.query(sqlst)

    //Insert default mats (will be in 4 loop)
    //Location Mats Info 
    //Get all material possibilities
    const getter = `SELECT * FROM materials`
    const [getMats] = await pool.query(getter) 
    
    for (let i = 0; i < getMats.length; i++) {
        const locationmatsID = crypto.randomUUID()
        const currMatID = getMats[i].mat_id
        const currMatName = getMats[i].mat_name
        //DEFAULT PRICE 1.25
        sqlst = `INSERT INTO locationmats(location_mats_id, location, material_id, material_name) VALUES('${locationmatsID}','${location_rc_number}','${currMatID}', '${currMatName}');`
        pool.query(sqlst)
    }

    pool.commit()
    res.json(`Added location ${location_name} with RC of ${location_rc_number}`)

    
})

//Admin create employee
router.post('/createEmployee', async function(req, res) {
    const employee_id = crypto.randomUUID()
    const user_name = req.query.user_name
    const password = req.query.password
    const curr_location = req.query.curr_location //Can be null
    const business = req.query.business
    //Role is 'emp
    await pool.beginTransaction()
    const sqlst = `INSERT INTO employees`
    pool.commit()
    res.json("Employee added, TODO:RETURN OBJ")
})

//Admin edit location material price
router.patch('/update/:locationMatID', async function(req, res){
    const location_mats_id = req.query.location_mats_id;
    const new_price = req.query.new_price
    
    const sqlst = `UPDATE locationmats SET price = ${new_price} WHERE location_mats_id='${location_mats_id}'`;
    const [priceChange] = await pool.query(sqlst)
    res.json(priceChange)
})


module.exports = router