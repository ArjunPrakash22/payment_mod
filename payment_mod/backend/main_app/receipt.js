const puppeteer = require('puppeteer');
const pdftemplate = require('./hostel_receipt');
const fs = require('fs');
const path = require('path');

const download_receipt = async (req, res) => {
    try {
        const paymentMode  = req.body.paymentMode;
        const email=req.body.email;
        const amount=req.body.amount;
        const feestype=req.body.feestype;
        const feeDetails = getFeeDetails(feestype);
        const name=req.body.name;
        const admission_no=req.body.admission_no;


        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Generate the HTML content using the template function
        const htmlContent = pdftemplate({ name, admission_no, email, feeDetails,feestype,paymentMode,amount });

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

const clgfeeDetails = [
    {particulars: "College Fee", amount: " "},
    {particulars: "Admission Fee", amount: " "},
    {particulars: "Book & Record Note fee", amount: " "},
    {particulars: "Computer & Internet fee", amount: " "},
    {particulars: "Library fee", amount: " "},
    {particulars: "Sports fee", amount: " "},
    {particulars: "Annual day / cultural fee", amount: " "},
    {particulars: "Counselling fee (Mental wellness)", amount: " "},
    {particulars: "Lab/Hospital fee", amount: " "},
    {particulars: "ID Card", amount: " "},
    {
        particulars: "BP Apparatus, Stethoscope, Knee Hammer, Tongue Depressor, Thermometer, Tuning fork, Pen torch",
        amount: " ",
    },
    {particulars: "Coat (White)", amount: " "},
    {particulars: "Guest Lecture classes & Seminars", amount: " "},
];

const hostelFeeDetails = [
    {particulars: "Hostel Fees / annum", amount: " "},
];

const HostelCautiondeposit = [
    {particulars: "Hostel Caution deposit (Refundable)", amount: " "},
];

const tutionfeeDetails = [
    {particulars: "Tuition Fees", amount: " "},
];

const registerFeeDetails = [
    {particulars: "Dr. MGR Medical University Students Registration fee", amount: " "},
];
const TransportFeeDetails = [
    {particulars: "Transport Boarding Point", amount: " "},
];


function getFeeDetails(feeType) {
    switch(feeType) {
        case 'College':
            return clgfeeDetails;
        case 'Hostel':
            return hostelFeeDetails;
        case 'HostelCaution':
            return HostelCautiondeposit;
        case 'Tuition':
            return tutionfeeDetails;
        case 'Registration':
            return registerFeeDetails;
        case 'Transport':
            return TransportFeeDetails;
        default:
            return []; // Return an empty array or handle the default case
    }
}


module.exports = {
    download_receipt
};
