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

  // Validate required fields
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
    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert into students_registration table
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
      (err, result) => {
        if (err) {
          console.error('Error inserting data into students:', err);
          return res.status(500).json({ message: 'Registration failed', error: err.message });
        }

        // Insert into users table
        db.query(
          `INSERT INTO users (email, password) VALUES (?, ?)`,
          [email_id, hashedPassword],
          (err, result) => {
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
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

const login=async (req, res) => {
  
    const { username, password } = req.body;
    console.log(req.body);
  
    // Check if the user exists in the database
    db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
      if (err) {
        res.status(500).json({ error: "Error fetching user from MySQL" });
        return;
      }
  
      if (results.length > 0) {
        const user = results[0];
        console.log(user.password);
        if(password == user.password){
          console.log("true");
        }
  
        // Compare the password provided with the hashed password in the database
       bcrypt. compare(password, user.password, (err, isMatch) => {
          if (err) {
            res.status(500).json({ error: "Error comparing passwords" });
            return;
          }
  
          if (isMatch) {
            res.json({ success: true });
          } else {
            res.json({ success: false, message: "Invalid username or password" });
          }
        });
      } else {
        res.json({ success: false, message: "Invalid username or password" });
      }
    });
  };


module.exports = {
    login,
    registration,
    db
};
