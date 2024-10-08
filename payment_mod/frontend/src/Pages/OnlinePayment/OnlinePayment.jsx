import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './OnlinePayment.css'; 
import qrCodeImage from '../../Assets/pictures/qr.png';

const OnlinePayment = () => {
  const location = useLocation();
  const students = location?.state?.students || {};
  const { studentName, admissionNo, feeType, amount,email,phone_no,regno } = location.state || {};

  const feeAmounts = {
    'Tuition': 100000,
    'College': 400000,
    'Hostel': 50000,
    'Miscellaneous': 40000,
    'Caution Deposit': 10000,
    'Transport': 20000,
    'Registration': 5000
  };

  // Set the total fee amount based on the feeType
  const [totalFeeAmount, setTotalFeeAmount] = useState(feeAmounts[feeType] || 0);
  const [transactionId, setTransactionId] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [transactionTime, setTransactionTime] = useState('');
  const [isHalfPayment, setIsHalfPayment] = useState(false);
  const [isPaymentTypeSelected, setIsPaymentTypeSelected] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('Pending');
  const [showQRCode, setShowQRCode] = useState(false);
  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
  const [error, setError] = useState('');
  const paymentMode = 'online';

  const StorePaymentRequestDetails = async () => {
    try {
      var bill_no=1;
      await axios.post('http://localhost:5003/api/storepaymentrequest', {
        bill_no: bill_no++, 
        name: studentName,
        email: email,
        admission_no: admissionNo,
        regno: regno,
        phone_no:phone_no,
        cash_mode: paymentMode, 
        transactionId,
        transactionDate: `${transactionDate} ${transactionTime}`,
        feeType,
        amount: amount,
        status: 'pending', 
      });
      console.log('Payment details stored successfully');
      
    alert('Payment submitted, verification in progress');
    } catch (error) {
      console.error('Error storing payment details:', error);
      setError('Failed to store payment details.');
    }
  
  };
  





  const handlePayOnlineClick = () => {
    setShowQRCode(true);
    setIsPaymentInitiated(true);
  };

  const handlePaymentTypeChange = (e) => {
    setIsHalfPayment(e.target.value === 'half');
    setIsPaymentTypeSelected(true);
  };

  const handleSubmitPayment = async () => {
    setError('');

    // Validate input
    if (!transactionId) {
      setError('Please enter Transaction ID for online payments.');
      return;
    }

    if (!transactionDate || !transactionTime) {
      setError('Please enter both transaction date and time.');
      return;
    }

    try {
      
        // Submit payment details
      
      await StorePaymentRequestDetails();  // Download the receipt after submission
   // Trigger successful payment handling
    } catch (error) {
      console.error('Error during payment submission:', error);
      setError('Failed to complete payment process.');
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeImage;
    link.download = 'payment-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fee-payment-container">
      <h1 className="title">Online Fee Payment</h1>
      <div className="student-details">
      <h1>Online Fee Payment</h1>
      <p>Student Name: {studentName || 'N/A'}</p>
      <p>Admission No: {admissionNo || 'N/A'}</p>
      <p>Fee Type: {feeType || 'N/A'}</p>
      <p>Fee Amount: ₹{amount || 0}</p>
      <p>Phone Number: {phone_no || 'N/A'}</p>
      <p>Email: {email || 'N/A'}</p>
      </div>
      <div className="fee-details">
        <h2 className="fee-type">Fee Type: {feeType}</h2>
        <h3 className="fee-amount">Fee Amount: ₹{isHalfPayment ? (totalFeeAmount / 2).toFixed(2) : totalFeeAmount.toFixed(2)}</h3>
      </div>
 
      {!isPaymentTypeSelected && (
        <div className="payment-type-container">
          <label htmlFor="payment-type">Select Payment Type:</label>
          <select id="payment-type" onChange={handlePaymentTypeChange}>
            <option value="full">Full Payment</option>
            <option value="half">Half Payment</option>
          </select>
        </div>
      )}

      {showQRCode && (
        <div className="payment-info-container">
          <div className="qr-code-container">
            <h3>QR Code for Payment</h3>
            <img src={qrCodeImage} alt="Payment QR Code" style={{ width: '200px', height: '200px' }} />
            <button type="button" onClick={downloadQRCode}>Download QR Code</button>
          </div>
          <div className="transaction-id-container">
            <label htmlFor="transaction-id">Enter Transaction ID:</label>
            <input
              type="text"
              id="transaction-id"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="transaction-id-input"
            />
          </div>
          <div className="date-time-container">
            <label htmlFor="transaction-date">Enter Transaction Date:</label>
            <input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="transaction-date-input"
            />
          </div>
          <div className="time-container">
            <label htmlFor="transaction-time">Enter Transaction Time:</label>
            <input
              type="time"
              value={transactionTime}
              onChange={(e) => setTransactionTime(e.target.value)}
              className="transaction-time-input"
            />
          </div>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      {!isPaymentInitiated ? (
        <button type="button" onClick={handlePayOnlineClick} className="payment-button">
          Pay Online
        </button>
      ) : (
        <button type="button" onClick={handleSubmitPayment} className="submit-payment-button">
          Submit Payment
        </button>
      )}
    </div>
  );
};

export default OnlinePayment;
