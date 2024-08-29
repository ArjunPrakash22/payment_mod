const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'gayathiri',
    password: 'root',
    database: 'registration_database'
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
        counseling_code, email_id, password, student_name, date_of_birth,
        community, course_name, phone_number, batch_year
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    return new Promise((resolve, reject) => {
        db.query(sqlInsert, [
            data.counseling_code, data.email_id, data.password, data.student_name, data.date_of_birth,
            data.community, data.course_name, data.phone_number, data.batch_year
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


module.exports = {
    insertRegistrationData
};
