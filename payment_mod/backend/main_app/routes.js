const express = require('express');
const router = express.Router();
const multer=require('multer');
const { download_receipt } = require('./receipt');
const {registration, FeeUpdate,getStudents,updateStudent} = require('./db');
const {login} = require('./db');
const {displayDashboard}=require('./db');
const {emailcheck,Aadharcheck}=require('./db');

const upload = multer();

router.post('/api/download_receipt', download_receipt);
router.post('/api/register',upload.none(),registration);
router.post('/api/check-email/',emailcheck);
router.post('/api/login',login);
router.post('/api/students_details/', getStudents);
router.post('/api/students/', updateStudent);
router.post('/api/dashboard/',displayDashboard)
router.post('/api/studentfee',FeeUpdate);
router.post('/api/check-aadhar/',Aadharcheck);


module.exports = router;
