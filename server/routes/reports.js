const express = require("express")
const router = express.Router()
const pool = require('../db/dbconnection')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const { timeStamp, time } = require("console")


// This will get a reports info
// router.get()


//Generate shipping report this is to be put into the database
router.post("/:location_rc/:material/generate_shipping_report", async function(req,res){

    //Get material and location from params
    const material = req.params.material
    const location_rc = req.params.location_rc
    //Shipping Report ID
    const id = crypto.randomUUID()
    console.log(material)

    //Get date (Should be NOW)
    const date = new Date()

    await pool.beginTransaction();

    //Update and get current sequence
    let sqlst = `UPDATE curr_shipping_report_sequence 
    SET sequence = sequence + 1
    WHERE location = '${location_rc}';`

    await pool.query(sqlst)

    //TODO Can remove this query by the receiving query above
    sqlst =`SELECT sequence 
    FROM curr_shipping_report_sequence
    WHERE location = '${location_rc}'`

    const seq_response = await pool.query(sqlst)
    const sequence = seq_response[0][0].sequence
    console.log(sequence)
    
    //Check for the latest shipping report with material and location
    sqlst = `SELECT timestamp FROM shipping_reports WHERE location = '${location_rc}' AND material = '${material}' ORDER BY timestamp DESC LIMIT 1;`

    //Store latest date
    const [latest] = await pool.query(sqlst)
    
    console.log(`LATET DATE: ${latest}`)
    

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

        console.log(ticket_details)

        //Initiaize then calculate the weights
        let seg_wt = 0
        let scrap = 0
        let total_wt = 0
        let red_wt = 0
        let refund_val = 0


        
        for (let index = 0; index < ticket_details.length; index++) {
            
            //Calculate scrap or red weight
            if (ticket_details[index].is_scap === 0) {
                scrap += parseFloat(ticket_details[index].adj_weight)
            } else {
                seg_wt += parseFloat(ticket_details[index].adj_weight )
            }

            //Add price
            refund_val += parseFloat(ticket_details[index].price)
            //Total weight is 
            total_wt = parseFloat(scrap) + parseFloat(seg_wt)
            //Red_wt
            red_wt =  parseFloat(seg_wt)
            
        }
        
        //Add Shipping Report
        sqlst = `INSERT INTO shipping_reports(id, refund_value, scrap, seg_weight, redemption_weight, material, location, sequence_num)
        VALUES('${id}', '${refund_val}', '${scrap}', '${seg_wt}', '${red_wt}', '${material}', '${location_rc}', '${sequence}');`
        await pool.query(sqlst)

        //Create return object 
        const shipping_details = {
            seg_wt: seg_wt,
            scrap: scrap,
            total_wt: total_wt,
            red_wt: red_wt,
            refund_val: refund_val,
        }

        await pool.commit()
        
        console.log(shipping_details)
    } else {
        //Find all shipping reports after latest with the right material and location
        //Find all tickets in a given location from last shipping report time
        console.log("Been TICKETS")
        

        const mysqlTimestamp = moment(latest[0].timestamp).format("YYYY-MM-DD HH:mm:ss");
        const unix = new Date()

        console.log(unix)
        let sqlst = `SELECT ticket_id FROM tickets WHERE location="${location_rc}" AND timestamp > ${JSON.stringify(latest[0].timestamp)};`

        const [ticket_ids] = await pool.query(sqlst)

        console.log(ticket_ids)

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

        //Initiaize then calculate the weights
        let seg_wt = 0
        let scrap = 0
        let total_wt = 0
        let red_wt = 0
        let refund_val = 0

        for (let index = 0; index < ticket_details.length; index++) {
            
            //Calculate scrap or red weight
            if (ticket_details[index].is_scap === 0) {
                scrap += parseFloat(ticket_details[index].adj_weight)
            } else {
                seg_wt += parseFloat(ticket_details[index].adj_weight )
            }

            //Add price
            refund_val += parseFloat(ticket_details[index].price)
            //Total weight is 
            total_wt = parseFloat(scrap) + parseFloat(seg_wt)
            //Red_wt
            red_wt =  parseFloat(seg_wt)
            
        }

        //Add Shipping Report
        sqlst = `INSERT INTO shipping_reports(id, refund_value, scrap, seg_weight, redemption_weight, material, location, sequence_num)
        VALUES('${id}', '${refund_val}', '${scrap}', '${seg_wt}', '${red_wt}', '${material}', '${location_rc}', '${sequence}');`
        await pool.query(sqlst)

        //Create return object 
        const shipping_details = {
            seg_wt: seg_wt,
            scrap: scrap,
            total_wt: total_wt,
            red_wt: red_wt,
            refund_val: refund_val,
        }
        
        await pool.commit()
        console.log(shipping_details)

    }

})

//




module.exports = router