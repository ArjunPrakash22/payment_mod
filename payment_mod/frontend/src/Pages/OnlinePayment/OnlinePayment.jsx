import React, { useState } from 'react';
import axios from 'axios';
import './OnlinePayment.css'; // Import the CSS file
import qr from 'C:/Users/S SWETHA/Desktop/Sss medical college/payment_mod/payment_mod/frontend/src/Assets/pictures/qr.png'

const OnlinePayment = () => {
  const [transactionId, setTransactionId] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [name] = useState('John Doe'); // Replace with dynamic data
  const [rollNo] = useState('12345'); // Replace with dynamic data
  const [emailId] = useState('john.doe@example.com'); // Replace with dynamic data
  const feeType = 'Tuition Fee';
  const feeAmount = 1000; // Example fee amount
  const [verificationStatus, setVerificationStatus] = useState('Pending');

  const handlePaymentSubmission = async () => {
    const paymentData = {
      name,
      rollNo,
      emailId,
      transactionId,
      transactionDate,
      feeType,
      feeAmount,
      verificationStatus,
    };

    try {
      await axios.post('/api/payment-verification', paymentData);
      alert('Payment submitted successfully!');
    } catch (error) {
      console.error('Error submitting payment:', error);
    }
  };

  const handleVerify = () => {
    setVerificationStatus('Verified');
    // Send email notification logic goes here
  };

  return (
    <div className="fee-payment-container">
      <h1 className="title">Online Fee Payment</h1>
      <div className="fee-details">
        <h2 className="fee-type">Fee Type: {feeType}</h2>
        <h3 className="fee-amount">Fee Amount: ₹{feeAmount}</h3>
      </div>
      
      {/* Display QR Code Image */}
      <img className="qr-code" src={qr} alt="Payment QR Code" />
      <a className="download-link" href={qr} download="qrcode.png">Download QR Code</a>
      
      <div className="payment-form">
        <h3 className="form-title">Submit Payment</h3>
        <input
          className="input-field"
          type="text"
          placeholder="Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
        />
        <input
          className="input-field"
          type="date"
          placeholder="Transaction Date"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
        />
        <button className="submit-button" onClick={handlePaymentSubmission}>Submit Payment</button>
      </div>

      
    </div>
  );
};

export default OnlinePayment;
