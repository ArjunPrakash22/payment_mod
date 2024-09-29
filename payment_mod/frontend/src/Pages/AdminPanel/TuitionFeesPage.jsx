// src/Pages/TuitionFeesPage.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FeesPage.css';

const TuitionFeesPage = () => {
  const location = useLocation();
  const students = location.state?.students || {};
  const [paymentType, setPaymentType] = useState('full');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [amountToPay, setAmountToPay] = useState(students.tuition_fees);
  const [originalTuitionFee] = useState(students.tuition_fees); 
  const [hasHalved, setHasHalved] = useState(false); 
  const [paymentAccruedTimes, setPaymentAccruedTimes] = useState(students.paymentAccruedTimes || 0); 
  const navigate = useNavigate();

  useEffect(() => {
    if (paymentType === 'half' && !hasHalved) {
      setAmountToPay(originalTuitionFee / 2); // Halve it only once
      setHasHalved(true); // Mark that it's been halved
    } else if (paymentType === 'full') {
      setAmountToPay(originalTuitionFee); // Reset to full payment
      setHasHalved(false); // Reset the halving flag when full is selected
    }
  }, [paymentType, originalTuitionFee, hasHalved]);

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
    setPaymentMode(e.target.value);
  };

  const Download_tuition= async () => {
    try {
      const response = await axios.post(
        "http://localhost:5003/api/download_receipt",
        { email: students.email,
          amount: amountToPay,
          feestype: 'Tuition',
          paymentMode:paymentMode,
          name:students.name,
          admission_no:students.admission_no,

         }, // Send student email to identify receipt
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', 'Tuition_receipt.pdf');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading the PDF:', error);
    }
  };
  const handleCancel = () => {
    // Redirect back to the admin panel
    navigate('/admin');
  };

  const storePaymentDetails = async () => {
    const transactionId = paymentMode === 'Online' ? generateTransactionId() : ''; // Placeholder for transaction ID generation
    const paymentDate = new Date().toISOString().slice(0, 10); 
    try {
      await axios.post(`http://localhost:5003/api/storePaymentDetails`, {
        name: students.name,
        email: students.email,
        admission_no: students.admission_no,
        regno: students.regno,
        amount: amountToPay,
        phone_no: students.phone_no, // Ensure this field exists in students object
        payment_mode: paymentMode,
        transaction_id: transactionId,
        feeType: 'Tuition',
        date: paymentDate
      });
      
      console.log('Payment details stored successfully');
    } catch (error) {
      console.error('Error storing payment details:', error);
    }
  };

  const generateTransactionId = () => {
    return 'TXN' + Math.floor(Math.random() * 1000000000);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    try {

      await storePaymentDetails();
      await axios.post(`http://localhost:5003/api/studentfee`, {
        email: students.email,
        ...students,
        tuition_fees: paymentType === 'half' ? originalTuitionFee / 2 : 0, // Update fee after payment
        paymentAccruedTimes: paymentAccruedTimes + 1
      });

      console.log(`Payment processed for ${students.name}: ₹${amountToPay} (${paymentType} payment)`);
      setPaymentAccruedTimes(paymentAccruedTimes + 1);
      await Download_tuition();
      navigate('/admin',{state:{key:"SsSaDmin153@gmail.com"}});
    } catch (error) {
      console.error('Error processing payment:', error);

      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
    }
  };

  return (
    <div className="payment-container">
      <h2>Payment Details</h2>
      <div className="student-details">
        <p><strong>Name:</strong> {students.name}</p>
        <p><strong>Reg No:</strong> {students.regno}</p>
        <p><strong>Fee Type:</strong> Tuition Fee</p>
        <p><strong>Total Amount:</strong> ₹{students.tuition_fees}</p>
      </div>
      <form onSubmit={handlePaymentSubmit} className="payment-form">
        <div className="form-group">
          <label>Payment Type:</label>
          <select value={paymentType} onChange={handlePaymentTypeChange}>
            <option value="full">Full Payment</option>
            <option value="half">Half Payment</option>
          </select>
        </div>
        <div>
        <select value={paymentMode} onChange={handlePaymentTypeChange}>
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
          </select>
        </div>
        <div className="amount-due">
          <p><strong>Amount to Pay:</strong> ₹{amountToPay}</p>
        </div>
        <button type="submit" className="pay-button">Generate Payment Receipt</button>
        <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  
  );
};

export default TuitionFeesPage;
