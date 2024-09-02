const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'paymentdb'
});

db.connect(err => {
    if (err) {
        console.log('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

function insertRegistrationData(data) {
    const sqlInsert = `INSERT INTO students_registration (
        counseling_code, email_id, student_name, date_of_birth,
        community, course_name, phone_number, batch_year
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
     const sqlinsert= `Insert into users (username,password) values (?,?)`;

    return new Promise((resolve, reject) => {
        db.query(sqlInsert, [
            data.counseling_code, data.email_id, data.student_name, data.date_of_birth,
            data.community, data.course_name, data.phone_number, data.batch_year
        ], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                reject({ message: 'Error inserting data', error: err });
            } else {
                resolve('Registration successful');
            }
        });
        db.query(sqlinsert,[
            data.email_id,
            data.password
        ], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                reject({ message: 'Error inserting data', error: err });
            } else {
                resolve('Registration successful');
            }
    });
    });
}

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
    insertRegistrationData,
    login
};
