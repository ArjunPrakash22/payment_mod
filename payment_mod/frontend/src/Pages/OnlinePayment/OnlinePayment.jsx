import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './OnlinePayment.css'; 
import qrCodeImage from '../../Assets/pictures/qr.png';

const OnlinePayment = () => {
  const location = useLocation(); 
  const { students, feeType } = location.state; // feeType passed from dashboard


  const feeAmounts = {
    'Tuition': 100000,
    'College': 400000,
    'Hostel': 50000,
    'Miscellaneous' : 40000,
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

  const storePaymentDetails = async () => {
    try {
      await axios.post('http://localhost:5003/api/storePaymentDetails', {
        name: students.name,
        email: students.email,
        admission_no: students.admission_no,
        regno: students.regno,
        phone_no: students.phone_no, 
        transactionId,
        transactionDate: `${transactionDate} ${transactionTime}`,
        feeType,
        feeAmount: isHalfPayment ? totalFeeAmount / 2 : totalFeeAmount,
        verificationStatus,
      });
      console.log('Payment details stored successfully');
    } catch (error) {
      console.error('Error storing payment details:', error);
    }
  };

  const handlePaymentSuccess = () => {
    storePaymentDetails();
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

  const Download_Receipt = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5003/api/download_receipt",
        {
          email: students.email,
          amount: totalFeeAmount,
          feestype: feeType,
          paymentMode,
          name: students.name,
          admission_no: students.admission_no,
        }, 
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', 'fees_receipt.pdf');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading the PDF:', error);
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
  
    handlePaymentSubmission();  // Submit payment details
  
    alert('Payment submitted, verification in progress');
  
    Download_Receipt();  // Download the receipt after submission
  
    handlePaymentSuccess();  // Trigger successful payment handling
  
    // Prevent going back to the previous page
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', function(event) {
      window.history.pushState(null, null, window.location.href);
    });
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
