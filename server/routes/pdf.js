const express = require("express");
const doc = require("pdfkit");
const router = express.Router()
const PDFDocument = require('pdfkit')


router.post('/generate-ticket', async function(req, res){
    //Ticket content
    const  content = req.body.ticket;
    const doc = new PDFDocument;

   
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');
    //Begine pipe to stream
    doc.pipe(res)
    //Write Content
    doc.text(`RC Number: ${content['location']}`)

    //Finalize document
    doc.end();

    



})


module.exports = router