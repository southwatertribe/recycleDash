const express = require("express");
const doc = require("pdfkit");
const router = express.Router()
const PDFDocument = require('pdfkit')

//generate a ticket for the web to view
router.post('/generate-ticket/web-view', async function(req, res){
    //Ticket content
    const  content = req.body.ticket;
    //Ticket details
    const details = content.details

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
    // Add Location RC Number
    doc.fontSize(12).text(`Location RC Number: ${content['location']}`, 50, 50);

    // Add Ticket Number
    doc.fontSize(14).text(`Ticket # ${content['sequence_num']}`, 300, 50, { align: 'right' });

    // Add Date and Customer
    doc.fontSize(12).text('Date:', 50, 110);
    doc.fontSize(12).text(content['timestamp'], 120, 110);
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


module.exports = router