const express = require('express');
const router = express.Router();
const multer = require('multer');
const { hashPassword } = require('./hashing');
const { insertRegistrationData } = require('./db');

const upload = multer(); // Add multer for handling file uploads

const registration= async (req, res) => {
    console.log("inside /register");
    const {
        counseling_code, email_id, password, student_name, date_of_birth,
        community, course_name, branch_name, phone_number, batch_year
    } = req.body;

    // Validate required fields
    if (!counseling_code || !email_id || !password || !student_name) {
        return res.status(400).send('Required fields are missing');
    }

    console.log('Received data:', req.body);

    try {
        // Hash the password before inserting it into the database
        const hashedPassword = await hashPassword(password);

        const registrationData = {
            counseling_code, email_id, password: hashedPassword, student_name, date_of_birth,
            community, course_name, phone_number, batch_year
        };
        console.log("registrationdata:",registrationData);

        const result = await insertRegistrationData(registrationData);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

module.exports = {
    registration
};
