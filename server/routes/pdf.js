const express = require("express");
const doc = require("pdfkit");
const router = express.Router()
const PDFDocument = require('pdfkit')
const pool = require('../db/dbconnection')

const fs = require('fs');
const path = require('path');


//TODO Maybe just fetch ticket by id and get everything but this may be redudndat
//generate a ticket for the web to view
router.post('/generate-ticket/web-view/', async function(req, res){
    //Ticket content
    const  content = req.body.ticket;
    console.log(req.body)
    //Ticket details
    const details = content.ticketDetails

    // Fetch company name
    const query = `SELECT * FROM locations WHERE location_rc_number = ?`;
    const [location] = await pool.query(query, content['location']);

    console.log(location)

    //Initialize a pdf document
    const doc = new PDFDocument;
     
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');
    //Begine pipe to stream
    doc.pipe(res)

    // Set the font style
    doc.font('Helvetica');

    //Write Content
    //Location Name
    doc.fontSize(12).text(`${location[0].company}`, 50, 50);
    // Add Location RC Number
    doc.fontSize(12).text(`Location RC Number: ${content['location']}`, 50, 80);
    

    // Add Ticket Number
    doc.fontSize(14).text(`Ticket # ${content['sequence_num']}`, 300, 50, { align: 'right' });

    // Add Date and Customer
    doc.fontSize(12).text('Date:', 50, 110);
    doc.fontSize(12).text(content['timestamp'].substring(0, 10), 120, 110);
    doc.fontSize(12).text('Customer:', 50, 130);
    doc.fontSize(12).text(content['customer'], 120, 130);
    
    // Add table headers
    const tableHeaders = ['Material', 'Amount', 'Take in Type', 'Total Price'];
    const headerY = 160;
    const columnWidth = 150;

    tableHeaders.forEach((header, index) => {
        doc.fontSize(12).text(header, index * columnWidth, headerY, { width: columnWidth, align: 'center' });
    });

    // Add separating line
    doc.moveTo(50, headerY + 20).lineTo(550, headerY + 20).stroke();

    // Add item details
    const startY = headerY + 30;
    const rowHeight = 35;

    details.forEach((item, index) => {
        const y = startY + index * rowHeight;

        doc.fontSize(12).text(item.material_name, 50, y, { width: columnWidth, align: 'center' });
        doc.fontSize(12).text(item.amount, 150, y, { width: columnWidth, align: 'center' });
        doc.fontSize(12).text(item.take_in_option, 300, y, { width: columnWidth, align: 'center' });
        doc.fontSize(12).text(item.price, 450, y, { width: columnWidth, align: 'center' });
    });

    // Add separating line
    const separatingLineY = startY + details.length * rowHeight + 10;
    doc.moveTo(50, separatingLineY).lineTo(550, separatingLineY).stroke();

    // Add total
    doc.fontSize(12).text('Total:', 350, separatingLineY + 20, { width: columnWidth, align: 'right' });
    doc.fontSize(12).text(content['total'], 500, separatingLineY + 20, { width: columnWidth, align: 'center' });

    // Add signature
    const signatureY = separatingLineY + 80; // Adjust the value to position the line lower
    doc.fontSize(12).text('Signature:', 50, signatureY);
    doc.moveTo(120, signatureY + 10).lineTo(250, signatureY + 10).stroke();

    //Add License
    const driverLicenseY = separatingLineY + 120; // Adjust the value to position the line lower
    doc.fontSize(12).text('License #:', 50, driverLicenseY);
    doc.moveTo(120, driverLicenseY + 10).lineTo(250, driverLicenseY + 10).stroke();

    //Finalize document
    doc.end();

})

router.post('/:shipping_report_id/generate_shipping_report/web_view/', async (req, res) => {
    try {
        const { shipping_report_id } = req.params;

        // Fetch shipping report data from the database
        const query = `SELECT * FROM shipping_reports WHERE id = ?`;
        const [shipping_report] = await pool.query(query, [shipping_report_id]);

        if (!shipping_report || shipping_report.length === 0) {
            return res.status(404).send('Shipping report not found');
        }

        const doc = new PDFDocument();

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=shipping_report_${shipping_report_id}.pdf`);
        
        // Pipe the PDF document to the response
        doc.pipe(res);

        // Populate PDF content based on shipping_report data
        doc.font('Helvetica');
        doc.fontSize(12).text(`Location RC Number: ${shipping_report[0].id}`, 50, 50);
        doc.fontSize(14).text(`Ticket # ${shipping_report[0].sequence_num}`, 300, 50, { align: 'right' });
        // ... Add more content based on your requirements ...

        // End and finalize the PDF document
        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});






module.exports = router