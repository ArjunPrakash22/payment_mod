const express = require('express');
const router = express.Router();
const multer=require('multer');
const { Hostel_receipt } = require('./receipt');
const {registration} = require('./db');
const {login} = require('./db');
const {getStudents,updateStudent}=require('./adminPanel');
const {displayDashboard}=require('./db');
const {OtpFunc,VerifyOtp,ResetPassword}=require('./forgotpassword');



const upload = multer();

router.post('/api/download_hostel_receipt', Hostel_receipt);
router.post('/api/register',upload.none(),registration);
router.post('/api/login',login);
router.get('/students', getStudents);
router.put('/students/:regNo', updateStudent);
router.post('/api/dashboard/',displayDashboard);
// router.post('/api/forgot-password/',OtpFunc);
// router.post('/api/verify-otp',VerifyOtp);
// router.post('/api/reset-password',ResetPassword );
router.post('/api/verify-otp', VerifyOtp);
router.post('/api/forgot-password', OtpFunc);
router.post('/api/reset-password', ResetPassword);




// router.post('/api/update-password',UpdatePassword);




module.exports = router;
