const express = require("express")
const router = express.Router()
const crypto = require('crypto')
const pool = require('../db/dbconnection')


//TODO OPRIMIZE AND ERROR HANDLE
//Create a ticket, should also create a cash dra__wer transaction, checks to consider are the weight limits and types of in takes
//Returns ticket total in an object and this is turned into a cash drawer transsaction
router.post("/:location_rc_number/new_ticket", async function(req,res) {

    try {
        //TODO CHECK AUTH WITH HEADERS
        //Logic
        //Create the TicketID
        const tickID = crypto.randomUUID()
        // // //List of all materials in this ticket
        const payload = req.body
        
        // // //Mother Ticket details
        const customer = payload.customer
        const location = req.params.location_rc_number
        const maker = payload.maker
        
        // // //Need to calculate the ticket details length
        const entries = Object.keys(payload.ticketDetails).length
        // //Start transaction
        await pool.beginTransaction();
        //Increment Sequence
        sqlst = `UPDATE curr_ticket_sequence
        SET sequence = sequence + 1
        WHERE location = '${location}';`
        await pool.query(sqlst)
        //Get sequence first
        sqlst = `SELECT sequence
        FROM curr_ticket_sequence
        WHERE location = '${location}';`
        const seq_response = await pool.query(sqlst)
        const sequence = seq_response[0][0].sequence

        // //Create mother ticket, then attach all details to her
        // //TODO: Look into generating the total 
        sqlst = `INSERT INTO tickets(ticket_id, customer, location, maker, sequence_num) VALUES('${tickID}', '${customer}', '${location}', '${maker}', '${sequence}');`
        pool.query(sqlst)
        // // //Loop and create tickdets
        // // //TODO: Will need to adjust given how you want the form
        // // //TODO: Handle the whole weight/sg wt formula here :)
        let total = 0
        for (let index = 0; index < entries; index++) {

            const currentDet = payload.ticketDetails[index]
            const take_in_option = currentDet.take_in_option //Single or weight
            const material = currentDet.material //Location material 
            //Will be int or float depending on take in
            //Amount will be stored despite tke in, price will only be stored calculated off weight
            //This will be used to calculate weight price
            const amount = currentDet.amount
            let adj_weight = 0
            //This will be the material price per pound
            //This is recieved from front end based on selected location mat
            //We have prce per unit saved in database, but this will be for ease of update, keep it at 0.05 currently 
            const mat_price = parseFloat(currentDet.mat_price)//Must parse float for calclations
            const mat_name = currentDet.material_name
            const is_scrap = currentDet.is_scrap
            //Adjust amount if tke in is by unit
            //Then calculate price 
            if (take_in_option === 'SC') {
                // This was given by unit calculate the weights
                // Conversion
                // (SC * 0.05)/CRV RATE (CRV rate will be per pound price)
                // This will calculate the weight, then multiply by per pound
                if (is_scrap === 0) {
                    //This usually doesnt happen so we are going to use a arbitrary mat price
                    adj_weight = (amount * 0.05) / 1.25;
                    price = 0;
                } else {
                    adj_weight = (amount * 0.05) / mat_price;
                    price = adj_weight * mat_price;
                }
            } 
            else {
                    adj_weight = amount
                    price = amount * mat_price;
            }
            
            total = total + price   //Add to total for mother ticket                                       //in weight 
            const sqlst = `INSERT INTO ticket_dets VALUES('${tickID}', '${material}', '${amount}', '${adj_weight}', '${price}', '${take_in_option}', '${mat_name}', '${is_scrap}')`;
            await pool.query(sqlst)
        }

        // //Set total for mother ticket
        sqlst = `UPDATE  tickets SET total='${total}' WHERE ticket_id='${tickID}'`
        await pool.query(sqlst)


        //Commit transaction
        await pool.commit()
        const obj = {
            'status': 200,
            'total': {total},
            "ticket_id": tickID
        }
        //TODO: Return an object
        res.json(obj) 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });        
    }
    
})

router.get("/:ticket_id/get_ticket", async function(req,res){
    try {
        const ticket_id = req.params.ticket_id
        
        const sqlst = `SELECT * FROM tickets WHERE ticket_id = '${ticket_id}';`

        const [ticket]= await pool.query(sqlst)


        console.log(ticket)
    
        res.json({
            status: 200,
            ticket: ticket
        })
    } catch (error) {
        console.log(error)        
    }
})

//Get ticket based on ticket num and location
router.get("/:location_rc/:sequence_num/get_ticket", async function(req,res){

    try {
        const location_rc = req.params.location_rc

        const sequence_num = req.params.sequence_num

        const sqlst = `SELECT * FROM tickets WHERE location='${location_rc}' AND sequence_num=${sequence_num}`
    
        const [ticket]= await pool.query(sqlst)
    
        res.json({
            status: 200,
            ticket: ticket
        })
        
    } catch (error) {
        console.error(error)
    }
})

//get multiple tickets based on location and time
router.get("/:location_rc_number/get-tickets/", async function(req, res){

    //Get location rc number
    const location = req.params.location_rc_number
    
    //Get from
    const start = req.query.start
    //Get To
    const end = req.query.end

    
    const sqlst = `
        SELECT *
        FROM tickets
        WHERE location = '${location}' AND DATE(timestamp) BETWEEN '${start}' AND '${end}';
    `

    const [tickets] = await pool.query(sqlst)

    res.json(
        {tickets}
    )
})

//Get all ticket details from ticket id
router.get("/:ticket_id/details", async function(req, res) {
    try {
        const ticket_id = req.params.ticket_id.trim();

        const sqslt = "SELECT * FROM ticket_dets WHERE ticket = ?";
        const [response] = await pool.query(sqslt, [ticket_id]);

        if (response.length === 0) {
            return res.status(404).json({
                status: 404,
                error: "Ticket details not found"
            });
        }

        console.log(response)

        res.json({
            status: 200,
            ticket_details: response
        });
    } catch (error) {
        console.error("Error fetching ticket details:", error);
        res.status(500).json({
            status: 500,
            error: "Internal Server Error"
        });
    }
});


//Void ticket
router.patch("/:ticket_id/void", async function(req,res) {
    try {
        const ticket_id = req.params.ticket_id
        // //Start transaction
        await pool.beginTransaction();
        //First check if ticket is voided or not
        sqlst = `SELECT void FROM tickets WHERE ticket_id=${ticket_id}`
        const [is_void] = pool.query(sqlst)

        if (is_void === 0) { 
            //Change to void which will be 1
            sqlst = `UPDATE tickets SET void = 1, total = 0, WHERE ticket_id = ${ticket_id}`
            pool.query(sqlst)


            //Void
            res.json({
                status: 200,
                result: "void"
            })
        } else {
            //Return stale
            res.json({
                status: 200,
                result: "stale"
            })
        }
        
    } catch (error) {
        
    }
})


//Change Ticket Details

module.exports = router