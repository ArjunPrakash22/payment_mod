const db=require('./db');

const getStudents = (req, res) => {
  const sqlQuery = 'SELECT * FROM student';
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server Error');
    } else {
      res.json(result);
    }
  });
};

const updateStudent = (req, res) => {
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
};

module.exports={
  getStudents,
  updateStudent
}