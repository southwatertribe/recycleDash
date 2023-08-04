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

    console.log(date)

    //Check for the latest shipping report with material and location
    let sqlst = `SELECT * FROM shipping_reports WHERE location_rc = '${location_rc}' AND material = '${material}' ORDER BY timestamp DESC LIMIT 1;`

    //Store latest date
    const [latest] = await pool.query(sqlst)
    

    if (latest.length === 0) {
         
        //Find all tickets in a given location
        let sqlst = `SELECT ticket_id FROM tickets WHERE location='${location_rc}'`
        const [ticket_ids] = await pool.query(sqlst)

        //Initialize list of ticket details
        let ticket_details = []
        
        //Find all ticket details
        for (let index = 0; index < ticket_ids.length; index++) {
            let curr_ticket_id = ticket_ids[index].ticket_id
            let sqlst = `SELECT * FROM ticket_dets WHERE ticket='${curr_ticket_id}' AND material_name LIKE '${material}%'`
            let [curr_load] = await pool.query(sqlst)

            //Track if there is a load of details
            if (curr_load.length != 0) {
                //Loop through and add dets to all details
                for (let index = 0; index < curr_load.length; index++) {
                    const det = curr_load[index];
                    //Push to ticket detail list to generate with
                    ticket_details.push(det)
                }              

            }            
        }

        //Calculate the weights
        

        console.log(ticket_details)
        
        
    } else {
        console.log("Previous Shipping Report Found")
        
    }



})

module.exports = router