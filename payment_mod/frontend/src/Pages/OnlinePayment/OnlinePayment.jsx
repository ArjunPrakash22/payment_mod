import React, { useState } from 'react';
import axios from 'axios';
import './OnlinePayment.css'; 
import qrCodeImage from '../../Assets/pictures/qr.png';

const OnlinePayment = () => {
  const [transactionId, setTransactionId] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [name] = useState('John Doe'); 
  const [rollNo] = useState('12345'); 
  const [emailId] = useState('john.doe@example.com'); 
  const feeType = 'Tuition Fee';
  const totalFeeAmount = 1000; 
  const [isHalfPayment, setIsHalfPayment] = useState(false);
  const [isPaymentTypeSelected, setIsPaymentTypeSelected] = useState(false); 
  const [verificationStatus, setVerificationStatus] = useState('Pending');
  const [showQRCode, setShowQRCode] = useState(false);
  const [transactionDateTime, setTransactionDateTime] = useState('');
  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
  const [error, setError] = useState(''); 

  const handlePaymentSubmission = async () => {
    const paymentData = {
      name,
      rollNo,
      emailId,
      transactionId,
      transactionDate,
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

  const handleTransactionIdChange = (event) => {
    setTransactionId(event.target.value);
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

    if (!transactionDateTime) {
      setError('Please enter both transaction date and time.');
      return;
    }

    const [date, time] = transactionDateTime.split('T');
    if (!date || !time) {
      setError('Please ensure the date and time are correctly entered.');
      return;
    }

    
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
      <div className="fee-details">
        <h2 className="fee-type">Fee Type: {feeType}</h2>
        <h3 className="fee-amount">Fee Amount: ₹{isHalfPayment ? (totalFeeAmount / 2).toFixed(2) : totalFeeAmount.toFixed(2)}</h3>
      </div>

   
      {!isPaymentTypeSelected && (
        <div className="payment-type-container">
          <label htmlFor="payment-type">Select Payment Type:</label>
          <select
            id="payment-type"
            onChange={handlePaymentTypeChange}
          >
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
              onChange={handleTransactionIdChange}
              className="transaction-id-input"
            />
          </div>
          <div className="date-time-container">
            <label htmlFor="transaction-date">Enter Transaction Date:</label>
            <input
              type="date"
              value={transactionDateTime.split('T')[0] || ''} 
              onChange={(e) => setTransactionDateTime(`${e.target.value}T${transactionDateTime.split('T')[1] || ''}`)}
              className="transaction-date-input"
            />
          </div>
          <div className="time-container">
            <label htmlFor="transaction-time">Enter Transaction Time:</label>
            <input
              type="time"
              value={transactionDateTime.split('T')[1] || ''} 
              onChange={(e) => setTransactionDateTime(`${transactionDateTime.split('T')[0]}T${e.target.value}`)}
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
