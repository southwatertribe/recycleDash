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




//Admin create employee
router.post('/employees/:business_id', async function(req, res) {
    const user_id = crypto.randomUUID()
    const user_name = req.body.user_name
    const salt = await bcrypt.genSalt(2)
    const password = await bcrypt.hash(req.body.password, salt);
    const curr_location = req.body.curr_location //Can be null
    const business = req.body.business
    const f_name = req.body.f_name
    const l_name = req.body.l_name
    //Role is 'emp
    await pool.beginTransaction()
    const sqlst = `INSERT INTO employees VALUES('${user_id}','${user_name}','${password}','${curr_location}','${business}','emp','','${f_name}', '${l_name}')`
    pool.query(sqlst)
    pool.commit()
    res.json("Employee added, TODO:RETURN OBJ")
})

//Get all employees by business id
router.get('/employees/:business_id', async function(req,res){

    //TODO: Only get the info you require from each employee you dont need everything 
    const business_id = req.query.business_id
    console.log("HIT GET ALL EMPLOYEES")
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


// //Update employee location
// router.patch('/update/emp-location/:user_id', async function(req,res) {

// })


//Admin edit location material price
router.patch('/update/location_mats/:location_mat_id', async function(req, res){
    const location_mats_id = req.query.location_mats_id;
    const new_price = req.body.new_price
    const sqlst = `UPDATE locationmats SET price = ${new_price} WHERE location_mats_id='${location_mats_id}'`;
    const [priceChange] = await pool.query(sqlst)
    res.json(priceChange)
})


module.exports = router