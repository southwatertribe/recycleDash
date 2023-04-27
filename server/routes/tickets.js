const express = require("express")
const router = express.Router()
const crypto = require('crypto')
const pool = require('../db/dbconnection')


//Create a ticket, should also create a cash drawer transaction, if we dont go atomic
router.post("/tickets/", async function(req,res) {

    //TODO CHECK AUTH WITH HEADERS
    //Logic
    //Create the TicketID
    const tickID = crypto.randomUUID()
    //Create the trasnaction id
    const trasnaction_id = crypto.randomUUID()
    //Store
    const payload = req.body.dets
    //Cash Drawer ID 
    const cash_drawer_id = payload.cash_drawer_id
    //Mother Ticket details
    const customer = payload.customer
    const location = payload.location
    const maker = payload.maker
    //Need to calculate the ticket details length
    const entries = Object.keys(payload.entries).length
    //Start transaction
    await pool.beginTransaction();
    //Create mother ticket, then attach all details to her
    //TODO: Look into generating the total 
    sqlst = `INSERT INTO tickets(ticket_id, customer, location, maker) VALUES('${tickID}', '${customer}', '${location}', '${maker}');`
    pool.query(sqlst)
    //Loop and create tickdets
    //TODO: Will need to adjust given how you want the form
    //TODO: Handle the whole weight/sg wt formula here :)
    let total = 0
    for (let index = 0; index < entries; index++) {

        const currentDet = payload.entries[index]
        const take_in_option = currentDet.take_in_option
        const material = currentDet.material
        //Will be int or float depending on take in
        const amount = currentDet.amount
        //This should be calculated based on take in option
        const price = currentDet.price

        if (take_in_option === 'SC') { //This was given by unit calculate the weights 
            
        }
        total = total + (weight * price)
        const sqlst = `INSERT INTO ticket_dets VALUES('${tickID}', '${material}', '${weight}', '${price}')`;
        await pool.query(sqlst)
    }

    //Set total for mother ticket
    sqlst = `UPDATE  tickets SET total='${total}' WHERE ticket_id='${tickID}'`
    await pool.query(sqlst)
    
    //Cash_Drawer_transaction
    sqlst = `INSERT INTO cash_drawer_transactions(transaction_id,cash_drawer,transaction_type,amount) VALUES('${trasnaction_id}', '${cash_drawer_id}', 'ticket','${total}');`
    await pool.query(sqlst)
    //Commit transaction
    await pool.commit()
    

    //TODO: Return an object
    res.json(`Success ticket total came to: ${total}`) 
    
})

// //get multiple tickets based on location
// router.get("/getTickets", async function(req, res){
//     const location_id = req.body.location_id
    
//     const sqlst = `SELECT * FROM tickets where location_id='${location_id}' and  `
// })

//get a ticket


//Delete a ticket

//Update a ticket

module.exports = router