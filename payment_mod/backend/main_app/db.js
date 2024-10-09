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
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully', results });
  });
};


// const DisplayPayment = (_req, res) => {
//   const query = 'SELECT * FROM payment';
//   db.query(query, (err, results) => {
//       if (err) {
//           return res.status(500).json({ error: 'Database error' });
//       }
//       res.json(results);
// });
// };
  


// const StoreInPayment = (req, res) => {
//   const receipt_no = generateReceiptNumber(); 
//   const {

//       admission_no,
//       regno,
//       name,
//       email,
//       phone_no,
//       payment_mode,  
//       transaction_id,
//       date,         
//       feeType,
//       amount        
//   } = req.body;


//   const query = `INSERT INTO payment (
//       receipt_no,admission_number, regno, name, email, phone_no,payment_mode,
//       transaction_id, payment_date, fee_type,amount_paid
//   ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

 
//   db.query(query, [
//     receipt_no,admission_no, regno, name, email, phone_no,payment_mode,
//     transaction_id, date, feeType,amount
      
//   ], (err, _result) => {
//       if (err) {
//           return res.status(500).json({ error: 'Database error' });
//       }
//       res.status(201).json({ message: 'Payment history added' });
//   });
// };

// Helper function to generate a receipt number (example implementation)
// const generateReceiptNumber = () => {
//   return 'REC' + Math.floor(Math.random() * 1000000); // Generates a random receipt number
// };


const DisplayPayment = (_req, res) => {
  const query = 'SELECT * FROM payment';
  db.query(query, (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
});
};


// const emailcheck=(req,res)=>{
//   const email=req.body.mailid;
//   // console.log(email);
//   db.query(
//     `select count(*) as count from students where email=?`,[email],(err,result)=>{
//       if(err){
//         return res.status(500).send({error:"Database error"});
//       }
//       if(result[0].count>=1){
//         return res.status(409).send({error:"email already exist"});
//       }
//       return res.status(200).send({message:"Available"});
//     }
//   )

// };

// //Aadhar Check 
// const Aadharcheck=(req,res)=>{
//   const Aadhar =req.body.aadharno ;
//   console.log(Aadhar);
//   db.query(
//     `select count(*) as count from students where aadhar_no=?`,[Aadhar],(err,result)=>{
//       if(err){
//         return res.status(500).send({error:"Database error"});
//       }
//       if(result[0].count>=1){
//         return res.status(409).send({error:"Aadhar already exist"});
//       }
//       return res.status(200).send({message:"Available"});
//     }
//   )

// }
  


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
      receipt_no,admission_number, regno, name, email, phone_no,payment_mode,
      transaction_id, payment_date, fee_type,amount_paid
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  console.log(query, [
    receipt_no, admission_no, regno, name, email, phone_no, payment_mode,
    transaction_id, date, feeType, amount
]);
};
const StoreInPaymentFromDashboard = (req, res) => {
  const receipt_no = generateReceiptNumber(); 
  
  const {

      admission_no,
      regno,
      name,
      email,
      phone_no,
      cash_mode,  
      transaction_id,
      transaction_date,         
      fee_type,
      amount        
  } = req.body;


  const query = `INSERT INTO payment (
      receipt_no,admission_number, regno, name, email, phone_no,payment_mode,
      transaction_id, payment_date, fee_type,amount_paid
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  console.log(query, [
    receipt_no, admission_no, regno, name, email, phone_no, cash_mode,
    transaction_id, transaction_date, fee_type, amount
]);

 
  db.query(query, [
    receipt_no,admission_no, regno, name, email, phone_no,cash_mode,
    transaction_id, transaction_date, fee_type,amount
      
  ], (err, _result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error', details: err.message });

      }
      res.status(201).json({ message: 'Payment history added' });
  });
};

// Helper function to generate a receipt number (example implementation)
const generateReceiptNumber = () => {
  return 'REC' + Math.floor(Math.random() * 1000000); // Generates a random receipt number
};




const emailcheck=(req,res)=>{
  const email=req.body.mailid;
  // console.log(email);
  db.query(
    `select count(*) as count from students where email=?`,[email],(err,result)=>{
      if(err){
        return res.status(500).send({error:"Database error"});
      }
      if(result[0].count>=1){
        return res.status(409).send({error:"email already exist"});
      }
      return res.status(200).send({message:"Available"});
    }
  )

};

//Aadhar Check 
const Aadharcheck=(req,res)=>{
  const Aadhar =req.body.aadharno ;
  console.log(Aadhar);
  db.query(
    `select count(*) as count from students where aadhar_no=?`,[Aadhar],(err,result)=>{
      if(err){
        return res.status(500).send({error:"Database error"});
      }
      if(result[0].count>=1){
        return res.status(409).send({error:"Aadhar already exist"});
      }
      return res.status(200).send({message:"Available"});
    }
  )

}


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
      (err, _result) => {
        if (err) {
          console.error('Error inserting data into students:', err);
          return res.status(500).json({ message: 'Registration failed', error: err.message });
        }

        // Insert into users table
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
        "SELECT admission_no, regno, name, gender, dob, email, phone_no, aadhar_no, govt_school, course_name, batchyr, quota,reg_fees, clg_fees, hosteller,caution_deposit,hostel_fees, tuition_fees, miscellaneous_fees, reason, transport_fees, exam_fees FROM students WHERE email = ?",
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
  const displaySubject = async (req, res) => {
    const provisionalStatus = req.query.provisional;
    
    if (provisionalStatus) {
       
        const query = 'SELECT subject_code, fee_amount FROM subjects WHERE provisional_status = ?';
        db.query(query, [provisionalStatus], (err, results) => {
            if (err) {
                console.error('Error executing query:', err.stack);
                return res.status(500).json({ error: 'Database query error' });
            }
            res.json(results);
        });
    } else {
        const query = 'SELECT subject_code, fee_amount FROM subjects';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err.stack);
                return res.status(500).json({ error: 'Database query error' });
            }
            res.json(results);
        });
    }
  };
  
  const DisplayExamFeeTransactions = (_req, res) => {
    const query = 'SELECT * FROM examfee';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
  });
  };

  const StoreInExamFee = (req, res) => {
    const {
        name,
        regno,
        email,
        type,
        mode,
        amount,
        no_of_subjects,
        transaction_id,
        transaction_date,
        transaction_time
    } = req.body;

    const query = `INSERT INTO examfee (
        name, regno, email, type, mode, amount, no_of_subjects, transaction_id, transaction_date,transaction_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

    db.query(query, [
        name, regno, email, type, mode, amount, no_of_subjects, transaction_id, transaction_date,transaction_time
    ], (err, result) => {
        if (err) {
            console.error('Error storing exam fee record:', err);
            return res.status(500).json({ error: 'Failed to store exam fee record' });
        }
        res.status(201).json({ message: 'Exam fee record added' });
    });

};
const StoreInPaymentRequest = (req, res) => {
  const { bill_no, admission_no, name, regno, feeType, amount, email, phone_no, cash_mode, transactionId, transactionDate } = req.body;

  console.log("Received data:", req.body); // Logging received data

  const query = `INSERT INTO payment_request (
   admission_no, regno, name, email, phone_no, cash_mode, transaction_id, transaction_date, fee_type, amount, status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`;

  console.log("Executing query...");

  // Execute the query with a callback
  db.query(query, [
    admission_no, regno, name, email, phone_no, cash_mode, transactionId, transactionDate, feeType, amount
  ], (error, results) => {
    if (error) {
      console.error('Error details:', error.message); // Logging error message
      console.error('Stack trace:', error.stack); // Logging stack trace
      return res.status(500).json({ message: 'Server error. Could not create payment request.', error: error.message });
    }

    console.log("Query results:", results); // Logging successful query results
    res.status(200).json({ message: 'Payment request created successfully.', results });
  });
};




const getPaymentRequest = (_req, res) => {
  console.log(1);
  db.query(`SELECT * FROM payment_request`, (error, results) => {
    if (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ error: error.message });
    } else {
      res.json(results);
    }
  });
};



const UpdateAdminPanel= async (req, res) => {
  const { admission_no } = req.params;
  const { fee_type } = req.body;

  const query = `UPDATE student SET ${fee_type} = 0 WHERE admission_no = ?`;

  db.query(query, [admission_no], (err, _result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.send('Fee updated to 0');
  });
};

const UpdateAdminPanelFromRequest = async (req, res) => {
  const { email, fee_type } = req.body;

  if (!email || !fee_type) {
    return res.status(400).json({ error: 'Email and fee_type are required' });
  }

  console.log("swetha");

  // Create a dynamic query using a template literal
  const query = `UPDATE students SET ?? = ? WHERE email = ?`;
  const values = [fee_type, 0, email];
  
  db.query(query, values, (err, _result) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send('Fee updated to 0');
  });
};





const paymentRequestUpdate=async(req, res) => {
  const { transaction_id } = req.params;
  const { status } = req.body;

  const query = 'UPDATE payment_request SET status = ? WHERE transaction_id = ?';
  db.query(query, [status, transaction_id], (error, _results) => {
      if (error) {
          console.error('Error updating payment request:', error);
          return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Payment request updated successfully!' });
  });
};

const verifyPayment = async (req, res) => {
  const { id } = req.params; 
  const query = 'SELECT status FROM payment_request WHERE id = ?';

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error verifying payment status:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Payment request not found' });
    }
    const paymentStatus = results[0].status;
    if (paymentStatus === 'Paid') {
      return res.json({ message: 'Payment is verified.' });
    } else {
      return res.json({ message: 'Payment is not verified yet. Status: ' + paymentStatus });
    }
  });
};


const StoreInExamFeeRequest = async (req, res) => {
  const {
      name,
      regno,
      email,
      type,
      mode,
      amount,
      no_of_subjects,
      transaction_id,
      transaction_date,
      transaction_time
  } = req.body;

  const query = `INSERT INTO examfee_request (
      name, regno, email, type, mode, amount, no_of_subjects, transaction_id, transaction_date, transaction_time
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [
      name, regno, email, type, mode, amount, no_of_subjects, transaction_id, transaction_date, transaction_time
  ], (err, result) => {
      if (err) {
          console.error('Error storing exam fee request:', err);
          return res.status(500).json({ error: 'Failed to store exam fee request' });
      }
      res.status(201).json({ message: 'Exam fee request added' });
  });
};

const DisplayExamFeeRequests = async (req, res) => {
  try {
    const query = 'SELECT * FROM examfee_request';

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching exam fee requests:', err);
        
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No exam fee requests found' });
      }
      
      res.status(200).json(results);
    });
  } catch (error) {
    console.error('Unexpected error fetching exam fee requests:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const updateExamFeeRequestStatus = (req, res) => {
    const { transaction_id } = req.params;
    const { status } = req.body;

    const query = `UPDATE examfee_request SET status = ? WHERE transaction_id = ?`;
    
    db.query(query, [status, transaction_id], (err, result) => {
        if (err) {
            console.error('Error updating payment request status:', err);
            return res.status(500).json({ error: 'Failed to update payment request status' });
        }
        res.status(200).json({ message: `Payment request status updated to ${status}` });
    });
};




// const handleExamFeeTransaction = async (req, res) => {
//     const { transaction_id, action } = req.body; 
    
//     if (action === 'verify') {
//         const paymentRequestQuery = `SELECT * FROM examfee_request WHERE transaction_id = ?`;
//         db.query(paymentRequestQuery, [transaction_id], (err, results) => {
//             if (err || results.length === 0) {
//                 return res.status(404).json({ error: 'Payment request not found' });
//             }
//             const request = results[0];
//             StoreInExamFee({ body: request }, res);
//             updateExamFeeRequestStatus(req, res);
//         });
//     } else if (action === 'reject') {
//         updateExamFeeRequestStatus(req, res); 
//     } else {
//         res.status(400).json({ error: 'Invalid action' });
//     }
// };

  
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
  DisplayExamFeeTransactions,
  StoreInExamFee,
  DisplayPayment,
  StoreInPayment,
  displaySubject,
  StoreInPaymentRequest,
  getPaymentRequest,
  UpdateAdminPanel,
    StoreInExamFeeRequest,
    DisplayExamFeeRequests,
    //handleExamFeeTransaction,
    updateExamFeeRequestStatus,
    //verifyPayment,
    paymentRequestUpdate,
    UpdateAdminPanelFromRequest,
    insertData,
    emailcheck,
    Aadharcheck,
    verifyPayment,
    paymentRequestUpdate,
    StoreInPaymentFromDashboard,
    db
};