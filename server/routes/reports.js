const express = require("express")
const router = express.Router()
const pool = require('../db/dbconnection')
const crypto = require('crypto')
const bcrypt = require('bcrypt')



// This will get a reports info
// router.get()


// //Generate shipping report this is to be put into the database
//TODO, Make a function for this with start and end 

async function genShippingReport(material, location, starting_ticket, ending_ticket) {
    //Shipping Report ID
    const id = crypto.randomUUID()
    //Get all ticket dets 
    sqlst = `SELECT td.*
    FROM ticket_dets td
    JOIN tickets t ON td.ticket = t.ticket_id
    WHERE t.location = '${location}'
      AND t.sequence_num >= '${starting_ticket}' 
      AND t.sequence_num <= '${ending_ticket}' 
      AND td.material_name LIKE '%${material}%'           
    ORDER BY t.sequence_num;`

    const [retrieved_dets] = await pool.query(sqlst)
    console.log(retrieved_dets)

    //If there are no dets return the function
    if (!retrieved_dets.length) {
        return {
            "status": 201,
            "message": "No ticket details to retrieve",
            "id": null
        }
    }

    //Establihs Shipping Report Weights
    let scrap = 0
    let seg_weight = 0
    let redemption_weight = 0
    let refund_val = 0
    let total_weight = 0

    //Loop through retreived dets and 
    for (let index = 0; index < retrieved_dets.length; index++) {
        const current_detail = retrieved_dets[index];
        if (current_detail.is_scrap === 1) {
            seg_weight += parseFloat(current_detail.adj_weight)
            refund_val += parseFloat(current_detail.price)

        } else {
            scrap += parseFloat(current_detail.adj_weight)               
        }
    }

    redemption_weight += parseFloat(seg_weight)
    total_weight = parseFloat(seg_weight + scrap)

    //Update sequence
    sqlst = `UPDATE curr_shipping_report_sequence
        SET sequence = sequence + 1
        WHERE location = '${location}';`
    await pool.query(sqlst)
    
    //Get new Sequence
    sqlst = `SELECT sequence 
    FROM curr_shipping_report_sequence WHERE location='${location}'`

    const [sequence] = await pool.query(sqlst)

    const sequence_num = sequence[0].sequence
    

    //Sqlst to insert shipping_report
    sqlst = `INSERT INTO 
        shipping_reports(id, location, total_weight, scrap, seg_weight, redemption_weight, refund_value, material, sequence_num, starting_ticket, latest_ticket)
        VALUES('${id}', '${location}', '${total_weight}', '${scrap}', '${seg_weight}', '${redemption_weight}', '${refund_val}', '${material}', '${sequence_num}', '${starting_ticket}', '${ending_ticket}');`
    await pool.query(sqlst)

    return {
        "status": 200,
        "shipping_report_num": sequence_num,
        "id": id
    }

}

async function getAllTicketsToday(location_rc) {
    try {
        // Query to get all ticket details for today and count of unique tickets
        let sql = `
            SELECT
                t.void,
                t.shipped_in,
                td.*,
                (SELECT COUNT(DISTINCT t2.ticket_id)
                 FROM tickets t2
                 WHERE t2.location = '${location_rc}'
                 AND DATE(t2.timestamp) = CURDATE()) AS unique_ticket_count
            FROM
                tickets t
            LEFT JOIN
                ticket_dets td
            ON
                t.ticket_id = td.ticket
            WHERE
                location = '${location_rc}'
                AND DATE(t.timestamp) = CURDATE();`;

        // Store today's tickets and unique ticket count
        const [result] = await pool.query(sql);

        // Access the unique_ticket_count from the result
        const ticket_count = result[0].unique_ticket_count;

        // Remove the unique_ticket_count from the result
        delete result[0].unique_ticket_count;

        return {
            todays_tickets: ticket_count,
            ticket_details: result
        }
    } catch (error) {
        console.log(error);
    }
}



router.post("/:location_rc/:material/generate_shipping_report/", async function(req, res) {
    
    const encodedMaterial = req.params.material
    const material = decodeURIComponent(encodedMaterial);
    const location = req.params.location_rc

    //Get all tickets from starting to ending to add to shipping report
    const ending_ticket = req.body.ticketNumber    
    //First get the latest shipping report and check the latest ticket number
    let sqlst = `SELECT sr.*
    FROM shipping_reports sr
    JOIN curr_shipping_report_sequence cs ON sr.location = cs.location
    WHERE sr.material = '${material}'
    AND sr.location = '${location}'
    AND sr.sequence_num = cs.sequence
    ORDER BY sr.id DESC
    LIMIT 1;
    `

    //This is the latest shipping report
    const [latest_report] = await pool.query(sqlst)


    console.log(latest_report)

    //First check if it contains anything
    if (!latest_report.length) {
        //Starting ticket will be 1 which must be the latest ticket in entry
        const starting_ticket = 1
        console.log(`Starting Ticket if there was NONE previous report: ${starting_ticket}`)

        const obj = await genShippingReport(res, material, location, starting_ticket, ending_ticket)

        console.log(obj)
        res.json(obj)
    
    } else {
        //Starting ticket is in the payload
        const starting_ticket = latest_report[0].latest_ticket + 1
        console.log(`Starting Ticket if there was previous report: ${starting_ticket}`)
        const obj = await genShippingReport(res, material, location, starting_ticket, ending_ticket)
        res.json(obj)
        
    }

})

router.get("/:location_rc/snapshot/", async function (req, res) {

    const location_rc = req.params.location_rc;
    const ticket_obj = await getAllTicketsToday(location_rc)
    
    console.log(ticket_obj)

    res.json(ticket_obj)

});





module.exports = router