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


const getStudents = (req, res) => {
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
      // No rows were updated, possibly because the email doesn't exist
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
      // No rows were updated, possibly because the admission_no doesn't exist
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully', results });
  });
};




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
    console.log("login inside");
    console.log(req.body);
  
    // Check if the user exists in the database
    db.query("SELECT * FROM users WHERE email = ?", [username], (err, results) => {
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

  const displayDashboard = async (req, res) => {
    const studentEmail = req.body.studentEmail; // Assuming the email is passed in the request body
  
    try {
      console.log(`Fetching details for student with email: ${studentEmail}`);
  
      // Query the database for the student's details
      db.query(
        "SELECT admission_no, regno, name, gender, dob, email, phone_no, aadhar_no, govt_school, course_name, batchyr, quota, clg_fees, hosteller, hostel_fees, tuition_fees, miscellaneous_fees, reason, transport_fees, exam_fees FROM students WHERE email = ?",
        [studentEmail],
        (err, results) => {
          if (err) {
            console.error('Error fetching user from MySQL:', err);
            res.status(500).json({ error: "Error fetching user from MySQL" });
            return;
          }
  
          if (results.length > 0) {
            console.log('Student details fetched:', results[0]);
            res.json(results[0]);
          } else {
            console.log('No student found with that email.');
            res.status(404).json({ error: "Student not found" });
          }
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: "Unexpected error occurred" });
    }
  };
  
  const insertData = (req, res) => {
    const { subject_name, provisional_status, fees } = req.body;
  
    // Check if all required fields are provided
    if (!subject_name || !provisional_status || !fees) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    // Insert data into the database
    db.query(
      "INSERT INTO datas (subject_name, provisional_status, fees) VALUES (?, ?, ?)",
      [subject_name, provisional_status, fees],
      (err, result) => {
        if (err) {
          console.error('Error inserting data into MySQL:', err);
          return res.status(500).json({ error: "Database error" });
        }
  
        res.status(200).json({ message:"Data successfully inserted" });
      }
    );
  };
  
  
  

module.exports = {
    login,
    registration,
    displayDashboard,
    updateStudent,
    getStudents,
    FeeUpdate,
    insertData,
    db
};
