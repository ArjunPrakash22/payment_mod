const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'payment_db'
});

db.connect(err => {
    if (err) {
        console.log('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

const multer = require("multer");
const { hashPassword } = require("./hashing");

const upload = multer(); // Add multer for handling file uploads

const getStudents = (_req, res) => {
  console.log(1);
  db.query(`SELECT * FROM students`, (error, results) => {
    if (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: error.message });
    } else {
      res.json(results);
    }
  });
};

const FeeUpdate = (req, res) => {
  console.log("vantaen");
  const email = req.body.email;
  const updatedData = req.body;

  // Debugging checks
  console.log('Received email:', email);
  console.log('Received data for update:', updatedData);

  // Validate email
  if (!email || email === '0') {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!Object.keys(updatedData).length) {
    return res.status(400).json({ error: 'Update data is required' });
  }

  const query = `UPDATE students SET ? WHERE email = ?`;
  db.query(query, [updatedData, email], (error, results) => {
    if (error) {
      console.error("Error updating data:", error);
      return res.status(500).json({ error: error.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully', results });
  });
};

const updateStudent = (req, res) => {
  const admission_no = req.body.admission_no;
  const updatedData = req.body;

  // Debugging checks
  console.log('Received admission_no:', admission_no);
  console.log('Received data for update:', updatedData);

  // Validate admission_no
  if (!admission_no || admission_no === '0') {
    return res.status(400).json({ error: 'Valid admission_no is required' });
  }

  if (!Object.keys(updatedData).length) {
    return res.status(400).json({ error: 'Update data is required' });
  }

  db.query(`UPDATE students SET ? WHERE admission_no = ?`, [updatedData, admission_no], (error, results) => {
    if (error) {
      console.error("Error updating data:", error);
      return res.status(500).json({ error: error.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully', results });
  });
};

// Adding quota-based fee update function
const updateFeesByQuota = (req, res) => {
  const { quota, tuition_fees, reg_fees, hosteller, hostel_fees, exam_fees, miscellaneous_fees } = req.body;

  // Validate quota
  if (!quota || !tuition_fees) {
    return res.status(400).json({ error: 'Quota and tuition fees are required' });
  }

  // Debugging checks
  console.log('Received quota:', quota);
  console.log('Received tuition fees:', tuition_fees);

  // Prepare the query to update tuition fees based on quota
  const query = `
    UPDATE students 
    SET tuition_fees = ?, reg_fees = ?, hosteller = ?, hostel_fees = ?, exam_fees = ?, miscellaneous_fees = ?
    WHERE quota = ?
  `;
  db.query(query, [tuition_fees, reg_fees, hosteller, hostel_fees, exam_fees, miscellaneous_fees, quota], (error, results) => {
    if (error) {
      console.error("Error updating fees by quota:", error);
      return res.status(500).json({ error: error.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'No students found with the specified quota' });
    }

    res.json({ message: 'Fees updated successfully based on quota', results });
  });
};

const StoreInPayment = (req, res) => {
  const receipt_no = generateReceiptNumber(); 
  const {
    admission_no,
    regno,
    name,
    email,
    phone_no,
    payment_mode,  
    transaction_id,
    date,         
    feeType,
    amount        
  } = req.body;

  const query = `INSERT INTO payment (
    receipt_no, admission_number, regno, name, email, phone_no, payment_mode,
    transaction_id, payment_date, fee_type, amount_paid
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [
    receipt_no, admission_no, regno, name, email, phone_no, payment_mode,
    transaction_id, date, feeType, amount
  ], (err, _result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Payment history added' });
  });
};

// Helper function to generate a receipt number
const generateReceiptNumber = () => {
  return 'REC' + Math.floor(Math.random() * 1000000); // Generates a random receipt number
};

const emailcheck = (req, res) => {
  const email = req.body.mailid;
  db.query(
    `select count(*) as count from students where email = ?`, [email], (err, result) => {
      if (err) {
        return res.status(500).send({ error: "Database error" });
      }
      if (result[0].count >= 1) {
        return res.status(409).send({ error: "email already exists" });
      }
      return res.status(200).send({ message: "Available" });
    }
  );
};

// Aadhar Check
const Aadharcheck = (req, res) => {
  const Aadhar = req.body.aadharno;
  db.query(
    `select count(*) as count from students where aadhar_no = ?`, [Aadhar], (err, result) => {
      if (err) {
        return res.status(500).send({ error: "Database error" });
      }
      if (result[0].count >= 1) {
        return res.status(409).send({ error: "Aadhar already exists" });
      }
      return res.status(200).send({ message: "Available" });
    }
  );
};

// Registration functionality
const registration = async (req, res) => {
  console.log("inside /register");
  const {
    regno,
    student_name,
    gender,
    dob,
    email_id,
    phone_number,
    aadhar_no,
    govt_school,
    hosteller,
    course_name,
    batch_year,
    quota,
    password,
  } = req.body;

  if (
    !hosteller ||
    !email_id ||
    !password ||
    !student_name ||
    !dob ||
    !aadhar_no ||
    !course_name ||
    !govt_school ||
    !phone_number ||
    !batch_year ||
    !quota ||
    !gender
  ) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    const hashedPassword = await hashPassword(password);

    db.query(
      `INSERT INTO students (
        regno,
        name,
        gender,
        dob,
        email,
        phone_no,
        aadhar_no,
        govt_school,
        hosteller,
        course_name,
        batchyr,
        quota
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        regno,
        student_name,
        gender,
        dob,
        email_id,
        phone_number,
        aadhar_no,
        govt_school,
        hosteller,
        course_name,
        batch_year,
        quota
      ],
      (err, _result) => {
        if (err) {
          console.error('Error inserting data into students:', err);
          return res.status(500).json({ message: 'Registration failed', error: err.message });
        }

        db.query(
          `INSERT INTO users (email, password) VALUES (?, ?)`,
          [email_id, hashedPassword],
          (err, _result) => {
            if (err) {
              console.error('Error inserting data into users:', err);
              return res.status(500).json({ message: 'Registration failed', error: err.message });
            }

            res.status(200).json({ message: 'Registration successful' });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};
