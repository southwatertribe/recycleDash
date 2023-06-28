const express = require("express")
const router = express.Router()
const pool = require('../db/dbconnection')
const crypto = require('crypto')
const bcrypt = require('bcrypt')

//Get all locations based on biz id used by all
router.get("/:business_id/locations/", async function(req, res) {
    console.log("HIT")
    //Business ID
    const business_id = req.params.business_id 
    console.log(business_id)
    //Gets all info
    const sqlst = `SELECT l.*, c.cash_drawer_id 
                   FROM locations l 
                   LEFT JOIN cash_drawers c ON l.location_rc_number = c.location 
                   WHERE l.business_id = '${business_id}'`

    const [results] = await pool.query(sqlst)
    
    res.json(results)
    
});



//Add a location, should only be allowed for admins
//Admin creates new location query post RC Number
router.put('/:business_id/locations/:rc_number', async function (req,res, next) {
    console.log("Add location hit")
    //All details
    const details = req.body
    console.log(`Info is: ${details}`)
    //Address info
    const address_id = crypto.randomUUID()
    const address_line_1 = details.address_line_1
    const address_line_2 = details.address_line_2
    const city = details.city
    const state = details.state
    const zipcode = details.zipcode
    
    //Cash Drawer Info
    const cash_drawer_id = crypto.randomUUID()

    
    //Location Info
    const business_id = details.business_id
    console.log(`business id = ${details.business_id}`)
    //RC NUMBER IS PARAMETER
    const location_rc_number = req.params.rc_number
    const location_name = details.location_name

    //Begin trasnsaction to add admin
    await pool.beginTransaction()
    //Insert location
    sqlst = `INSERT INTO locations(location_rc_number, location_name, business_id) VALUES('${location_rc_number}','${location_name}','${business_id}')`
    pool.query(sqlst)
    //Insert into location_address
    sqlst = `INSERT INTO location_addresses(address_id, address_line_1, address_line_2, city, state, zipcode, pert_location) VALUES('${address_id}', '${address_line_1}', '${address_line_2}', '${city}', '${state}', '${zipcode}', '${location_rc_number}')` 
    pool.query(sqlst)
    //Insert into cash Drawer
    sqlst = `INSERT INTO cash_drawers(cash_drawer_id, total, location) VALUES('${cash_drawer_id}', 0, '${location_rc_number}')`
    pool.query(sqlst)
    //Begin ticket sequence
    sqlst = `INSERT INTO curr_ticket_sequence(location, sequence) VALUES('${location_rc_number}', 0)`
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
        const is_scrap = getMats[i].is_scrap
        //DEFAULT PRICE 1.25
        //0 if is_scrap === 0

        if (is_scrap === 0) {
            //Price mus be 0
            sqlst = `INSERT INTO locationmats(location_mats_id, location, price, material_id, material_name, price_per_unit) VALUES('${locationmatsID}','${location_rc_number}', '${0}', '${currMatID}', '${currMatName}','${0}');`
            pool.query(sqlst)
        } else {
            sqlst = `INSERT INTO locationmats(location_mats_id, location, material_id, material_name) VALUES('${locationmatsID}','${location_rc_number}','${currMatID}', '${currMatName}');`
            pool.query(sqlst)
        }
        
    }

    pool.commit()
    const returnOBJ = {
        "status": 200,
        "added": location_name
    }
    res.json(returnOBJ)
    
})


//Get Location Mats by Location ID used by all
router.get("/:rc_number/location_mats/", async function(req,res) {
    const rc_number = req.params.rc_number
    console.log(rc_number)
    const sqlst = `SELECT * FROM locationmats WHERE location='${rc_number}';`

    const [location] = await pool.query(sqlst)

    
    res.json(location)
})

//Get cash drawer information
router.get("/:location_id/cash-drawer/", async function(req, res) {
    const location_id = req.params.location_id
    const sqlst = `SELECT cash_drawer_id FROM cash_drawers WHERE location='${location_id}'`
    const [cash_drawer] = await pool.query(sqlst)
    
    res.json({
        "status": 200,
        "cash_drawer_id": cash_drawer[0].cash_drawer_id
    })
})

//Get cash drawer total of location
router.get("/:location_id/cash_drawer/total", async function(req,res){
    const location_id = req.params.location_id
    const sqlst = `SELECT total FROM cash_drawers WHERE location='${location_id}'`
    const [cash_drawer] = await pool.query(sqlst)
    res.json({
        "status": 200,
        "total": cash_drawer[0].total
    })
})


//Update cash drawer details and cash drawer total no ticket
router.put("/:location_id/:cash_drawer/cash_drawer_transactions", async function(req,res) {

    //Location should change to rc number
    const location_id = req.params.location_id
    //Transaction type
    const transaction_type = req.body.transaction_type
    //Cash Drawer
    const cash_drawer = req.params.cash_drawer
    //Amount
    const amount = req.body.amount
    //Transaction_id
    const trasnsaction_id = crypto.randomUUID()

    //Begin transaction 
    await pool.beginTransaction()
    const sqlst = `INSERT INTO cash_drawer_transactions(transaction_id, cash_drawer,transaction_type,amount) VALUES('${trasnsaction_id}', '${cash_drawer}', '${transaction_type}', '${amount}');`
    await pool.query(sqlst)
    await pool.commit()

    //Response if succcessfull
    const response = {
        "status": 200,
        "details": {
            "total": amount,
            "type": transaction_type,
            "id": trasnsaction_id
        }
    }

    res.json(response)

})



module.exports = router