const express = require('express');
const router = express.Router();
const { Hostel_receipt } = require('./receipt');

router.post('/api/download_hostel_receipt', Hostel_receipt);

module.exports = router;
