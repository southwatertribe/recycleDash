const express = require("express")
const router = express.Router()
const pool = require('../db/dbconnection')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const verifyJWT = require('../middleware/verifyJWT')
const { stat } = require("fs")

//Testing function during dev
router.get("/tester", async function(req, res) {
    const getter = `SELECT * FROM materials`
    const [getMats] = await pool.query(getter)
    res.json(getMats[1].mat_id)
})


//Admin creates new location
router.post('/addLocation', async function (req,res, next) {
    console.log("Add location hit")
    const details = req.body
    console.log(`Info is: ${details}`)
    //Address info
    const address_id = crypto.randomUUID()
    const address_line_1 = details.address_line_1
    const address_line_2 = details.address_line_2
    const city = details.city
    const state = details.state
    const zipcode = details.zipcode
    
    
    //Location Info
    const business_id = details.business_id
    console.log(`business id = ${details.business_id}`)
    const location_rc_number = details.location_rc_number
    const location_name = details.location_name

    //Begin trasnsaction to add admin
    await pool.beginTransaction()
    //Insert location
    sqlst = `INSERT INTO locations(location_rc_number, location_name, business_id) VALUES('${location_rc_number}','${location_name}','${business_id}')`
    pool.query(sqlst)
    //Insert into location_address
    sqlst = `INSERT INTO location_addresses(address_id, address_line_1, address_line_2, city, state, zipcode, pert_location) VALUES('${address_id}', '${address_line_1}', '${address_line_2}', '${city}', '${state}', '${zipcode}', '${location_rc_number}')` 
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
    const returnOBJ = {
        "status": 200,
        "added": location_name
    }
    res.json(returnOBJ)
    
})

//Admin create employee
router.post('/createEmployee', async function(req, res) {
    const user_id = crypto.randomUUID()
    const user_name = req.query.user_name
    const salt = await bcrypt.genSalt(2)
    const password = await bcrypt.hash(req.query.password, salt);
    const curr_location = req.query.curr_location //Can be null
    const business = req.query.business
    const f_name = req.query.f_name
    const l_name = req.query.l_name
    //Role is 'emp
    await pool.beginTransaction()
    const sqlst = `INSERT INTO employees VALUES('${user_id}','${user_name}','${password}','${curr_location}','${business}','emp','','${f_name}', '${l_name}')`
    pool.query(sqlst)
    pool.commit()
    res.json("Employee added, TODO:RETURN OBJ")
})

//Get all employees
router.get('/getEmployees', async function(req,res){

    //TODO: Only get the info you require from each employee you dont need everything 
    const business_id = req.query.business_id

    console.log(req.params.business_id)
    const sqlst = `SELECT * FROM employees WHERE business='${business_id}'`
    const [employees] = await pool.query(sqlst)
  
    const returnOBJ =  {
        "status": 200,
        "employee_list": employees
    }
    console.log(employees)
    res.json(returnOBJ)
})


//Update employee location
router.patch('/update/emp-location/:user_id', async function(req,res) {

})


//Admin edit location material price
router.patch('/update/location_mats/:location_mat_id', async function(req, res){
    const location_mats_id = req.query.location_mats_id;
    const new_price = req.query.new_price
    
    const sqlst = `UPDATE locationmats SET price = ${new_price} WHERE location_mats_id='${location_mats_id}'`;
    const [priceChange] = await pool.query(sqlst)
    res.json(priceChange)
})


module.exports = router