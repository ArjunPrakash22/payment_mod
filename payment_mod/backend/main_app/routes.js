const express = require('express');
const router = express.Router();
const multer=require('multer');
const { Hostel_receipt } = require('./receipt');
const {registration} = require('./db');
const {login} = require('./db');
const {getStudents,updateStudent}=require('./adminPanel');

const upload = multer();

router.post('/api/download_hostel_receipt', Hostel_receipt);
router.post('/api/register',upload.none(),registration);
router.post('/api/login',login);
router.get('/students', getStudents);
router.put('/students/:regNo', updateStudent);

module.exports = router;
