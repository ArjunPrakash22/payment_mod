const express = require('express');
const router = express.Router();
const multer=require('multer');
const { Hostel_receipt } = require('./receipt');
const {registration} = require('./auth')

const upload = multer();

router.post('/api/download_hostel_receipt', Hostel_receipt);
router.post('/api/register',upload.none(),registration)

module.exports = router;
