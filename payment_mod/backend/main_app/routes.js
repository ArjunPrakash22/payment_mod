const express = require('express');
const router = express.Router();
const multer = require('multer');
const { download_receipt } = require('./receipt');
const { registration, FeeUpdate, getStudents, updateStudent, StoreInPayment, DisplayPayment, displaySubject, DisplayExamFeeTransactions, StoreInExamFee, StoreInPaymentRequest, DisplayPaymentRequest } = require('./db'); // Import displaySubject and other required functions
const { login } = require('./db');
const { displayDashboard } = require('./db');

const upload = multer();

router.post('/api/download_receipt', download_receipt);
router.post('/api/register', upload.none(), registration);
router.post('/api/login', login);
router.post('/api/students_details/', getStudents);
router.post('/api/students', updateStudent);
router.post('/api/dashboard/', displayDashboard);
router.post('/api/studentfee', FeeUpdate);
router.post('/api/StorePaymentDetails', StoreInPayment);
router.post('/api/payment-history', DisplayPayment);
router.get('/api/subjects', displaySubject); // Make sure displaySubject is correctly imported
router.get('/api/examfee/transactions', DisplayExamFeeTransactions);
router.post('/api/examfee/record', StoreInExamFee);
router.post('/api/storepaymentrequest',StoreInPaymentRequest);
router.post('/api/displaypaymentrequest',DisplayPaymentRequest);

module.exports = router;
