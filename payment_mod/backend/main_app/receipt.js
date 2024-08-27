const puppeteer = require('puppeteer');
const pdftemplate = require('./hostel_receipt');
const fs = require('fs');
const path = require('path');

const Hostel_receipt = async (req, res) => {
    let browser;  // Declare browser here so it's accessible throughout the function

    try {
        const studentname = "arjun";

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Generate the HTML content using the template function
        const htmlContent = pdftemplate({ studentname });

        // Set the HTML content on the Puppeteer page
        await page.setContent(htmlContent);

        // Generate the PDF file
        const pdfBuffer = await page.pdf({printBackground:true, format:'A4'});

        // Set HTTP headers for download
        const filename = `hostel_rec.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Send the PDF buffer as response
        res.send(pdfBuffer);

        // Close the browser instance
        await browser.close();
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error });
    }

};

module.exports = {
    Hostel_receipt
};
