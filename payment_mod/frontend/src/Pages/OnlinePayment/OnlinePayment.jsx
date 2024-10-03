import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './OnlinePayment.css'; 
import qrCodeImage from '../../Assets/pictures/qr.png';

const OnlinePayment = () => {
  const location = useLocation(); 
  const { students } = location.state; 

  const [transactionId, setTransactionId] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [transactionTime, setTransactionTime] = useState('');
  const [isHalfPayment, setIsHalfPayment] = useState(false);
  const [isPaymentTypeSelected, setIsPaymentTypeSelected] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('Pending');
  const [showQRCode, setShowQRCode] = useState(false);
  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
  const [error, setError] = useState('');

  const feeType = 'Tuition Fee'; 
  const totalFeeAmount = students.tuition_fees; 

  const handlePaymentSubmission = async () => {
    const paymentData = {
      name: students.name, 
      regNo: students.regno, 
      emailId: students.email, 
      transactionId,
      transactionDate: `${transactionDate} ${transactionTime}`,
      feeType,
      feeAmount: isHalfPayment ? totalFeeAmount / 2 : totalFeeAmount,
      verificationStatus,
    };

    try {
      await axios.post('/api/payment-verification', paymentData);
      alert('Payment submitted successfully!');
    } catch (error) {
      console.error('Error submitting payment:', error);
    }
  };

  const handlePaymentSuccess = () => {
    const studentId = students.regno;
    axios.put(`http://localhost:3001/payment-request/${studentId}`, { status: 'paid' })
        .then(response => {
            alert('Payment successful!');
            axios.put(`http://localhost:3001/update-fee/${studentId}`, { fee_type: feeType })
                .then(() => {
                    console.log('Fee updated in admin panel.');
                })
                .catch(error => {
                    console.error('Error updating fee:', error);
                });
        })
        .catch(error => {
            console.error('Error updating payment status:', error);
        });
  };

  const handlePayOnlineClick = () => {
    setShowQRCode(true);
    setIsPaymentInitiated(true);
  };

  const handlePaymentTypeChange = (e) => {
    setIsHalfPayment(e.target.value === 'half');
    setIsPaymentTypeSelected(true);
  };

  const handleSubmitPayment = () => {
    setError('');

    if (!transactionId) {
      setError('Please enter Transaction ID for online payments.');
      return;
    }

    if (!transactionDate || !transactionTime) {
      setError('Please enter both transaction date and time.');
      return;
    }

    handlePaymentSubmission();
    alert('Payment submitted, verification in progress');
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
        <h3>Student Name: {students.name}</h3>
        <h3>Registration No: {students.regno}</h3>
        <h3>Email: {students.email}</h3>
        <h3>Phone: {students.phone_no}</h3>
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
        <button type="button" onClick={handleSubmitPayment} className="payment-button">
          Submit Payment
        </button>
      )}
    </div>
  );
};

export default OnlinePayment;
