const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
app.use(cors()); 
app.use(express.json()); 

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '', 
  database: 'studentdetails' 
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});


app.get('/api/students', (req, res) => {
  const sqlQuery = 'SELECT * FROM student';
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server Error');
    } else {
      res.json(result);
    }
  });
});


app.put('/api/students/:regNo', (req, res) => {
  const regNo = req.params.regNo;
  const updatedData = req.body;


  console.log('Received data for update:', updatedData);

  const query = `UPDATE student SET ? WHERE regNo = ?`;
  db.query(query, [updatedData, regNo], (error, results) => {
    if (error) {
      console.error("Error updating data:", error);
      res.status(500).json({ error: error.message });
    } else {
      res.json(results);
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
