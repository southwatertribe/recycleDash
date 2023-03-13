const express = require("express")
const router = express.Router()
const crypto = require('crypto')
const pool = require('../db/dbconnection')


//Create a ticket
router.post("/", async function(req,res) {

    //TODO CHECK AUTH WITH HEADERS
    //Logic
    //Create the TicketID
    const tickID = crypto.randomUUID()
    //Store
    const payload = req.body.dets
    //Mother Ticket details
    const customer = payload.customer
    const location = payload.location
    const maker = payload.maker
    //Need to calculate the ticket details length
    const entries = Object.keys(payload.entries).length
    //Start transaction
    await pool.beginTransaction();
    
        //Create mother ticket 
    //TODO: Look into generating the total 
    sqlst = `INSERT INTO tickets(ticket_id, customer, location, maker) VALUES('${tickID}', '${customer}', '${location}', '${maker}');`
    pool.query(sqlst)
    //Loop and create tickdets
    //TODO: Will need to adjust given how you want the form
    let total = 0
    for (let index = 0; index < entries; index++) {
        const currentDet = payload.entries[index]
        const material = currentDet.material
        const weight = currentDet.weight
        const price = currentDet.price
        total = total + (weight * price)
        const sqlst = `INSERT INTO ticket_dets VALUES('${tickID}', '${material}', '${weight}', '${price}')`;
        await pool.query(sqlst)
    }

    sqlst = `UPDATE  tickets SET total='${total}' WHERE ticket_id='${tickID}'`
    await pool.query(sqlst)
    //Commit transaction
    await pool.commit()
    
    res.json(`Success ticket total came to: ${total}`) 
    
})


//Delete a ticket

//Update a ticket

module.exports = router