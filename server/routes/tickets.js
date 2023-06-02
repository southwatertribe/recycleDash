const express = require("express")
const router = express.Router()
const crypto = require('crypto')
const pool = require('../db/dbconnection')


//Create a ticket, should also create a cash drawer transaction, checks to consider are the weight limits and types of in takes
//Returns ticket total in an object and this is turned into a cash drawer transsaction
router.post("/:location_rc_number/new_ticket", async function(req,res) {

    //TODO CHECK AUTH WITH HEADERS
    //Logic
    //Create the TicketID
    const tickID = crypto.randomUUID()
    //Create the trasnaction id
    const transaction_id = crypto.randomUUID()
    //List of all materials in this ticket
    const payload = req.body.dets
    //Cash Drawer ID 
    const cash_drawer_id = payload.cash_drawer_id
    //Mother Ticket details
    const customer = payload.customer
    const location = req.params.location_rc_number
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
        const take_in_option = currentDet.take_in_option //Single or weight
        const material = currentDet.material //Location material 
        //Will be int or float depending on take in
        //Amount will be stored despite tke in, price will only be stored calculated off weight
        //This will be used to calculate weight price
        const amount = currentDet.amount
        //This will be the material price per pound
        //This is recieved from front end based on selected location mat
        //We have prce per unit saved in database, but this will be for ease of update, keep it at 0.05 currently 
        const mat_price = currentDet.mat_price

        //Adjust amount if tke in is by unit
        //Then calculate price 
        if (take_in_option === 'SC') { //This was given by unit calculate the weights 
            //Conversion
            //(SC * 0.05)/CRV RATE (CRV rate will be per pound price)
            //This will calculate the weight, then multiply by per pound
            amount = (amount * 0.05) / mat_price
            price = amount * mat_price
            
        } else {
            price = amount * mat_price
        }
        
        total = total + price   //Add to total for mother ticket                                       //in weight 
        const sqlst = `INSERT INTO ticket_dets VALUES('${tickID}', '${material}', '${amount}', '${price}, '${take_in_option}')`;
        await pool.query(sqlst)
    }

    //Set total for mother ticket
    sqlst = `UPDATE  tickets SET total='${total}' WHERE ticket_id='${tickID}'`
    await pool.query(sqlst)
    
    //Cash_Drawer_transaction
    sqlst = `INSERT INTO cash_drawer_transactions(transaction_id,cash_drawer,transaction_type,amount) VALUES('${transaction_id}', '${cash_drawer_id}', 'ticket','${total}');`
    await pool.query(sqlst)
    //Commit transaction
    await pool.commit()
    
    const obj = {
        'status': 200,
        'total': {total}
    }
    //TODO: Return an object
    res.json(obj) 
    
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