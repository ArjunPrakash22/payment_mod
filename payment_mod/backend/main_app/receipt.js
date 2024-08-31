const puppeteer = require('puppeteer');
const pdftemplate = require('./hostel_receipt');
const fs = require('fs');
const path = require('path');

const Hostel_receipt = async (req, res) => {
    try {
        const studentname = "arjun";

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Generate the HTML content using the template function
        const htmlContent = pdftemplate( studentname );

        // Set the HTML content on the Puppeteer page
        await page.setContent(htmlContent);

        // Generate the PDF file
        const pdfPath = path.join(__dirname, 'debug.pdf');

        // Save the PDF to the filesystem
        await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });

        await browser.close();

        // Send the PDF file to the client
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=hostel_receipt.pdf`,
        });

        // Stream the PDF file to the client
        const fileStream = fs.createReadStream(pdfPath);
        fileStream.pipe(res);

        // Optionally delete the file after sending it
        fileStream.on('end', () => {
            fs.unlink(pdfPath, (err) => {
                if (err) console.error('Error deleting PDF:', err);
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error });
    }

};

module.exports = {
    Hostel_receipt
};
