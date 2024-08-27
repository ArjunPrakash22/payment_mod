const fs = require('fs');
const path = require('path');
global.appRoot = path.resolve(__dirname);

const pdftemplate = ({ name }) => {
    const today = new Date();

    return `<!doctype html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Hostel Receipt</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                padding: 20px;
            }
            h1 {
                color: #333;
            }
            p {
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <h1>Hello, ${name}</h1>
        <p>Today is ${today.getDate()}</p>
    </body>
    </html>`;
};

module.exports = pdftemplate;
