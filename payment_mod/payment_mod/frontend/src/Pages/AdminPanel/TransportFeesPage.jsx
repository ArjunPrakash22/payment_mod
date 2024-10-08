import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FeesPage.css';

const TransportFeesPage = () => {
  const location = useLocation();
  const students = location.state?.students || {}; // Correctly access students object
  const [paymentType, setPaymentType] = useState('full'); 
  const [amountToPay, setAmountToPay] = useState(students.transport_fees || 0); // Initialize with a fallback value
  const [paymentMode, setPaymentMode] = useState('Cash');
  const navigate = useNavigate();

  useEffect(() => {
    setAmountToPay(students.transport_fees || 0); // Update with a fallback value
  }, [paymentType, students.transport_fees]);

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
    setPaymentMode(e.target.value);
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
        feeType: 'Transport Fee',
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
    console.log('inside handlePaymentSubmit');
    e.preventDefault();
  
    // Debugging: Ensure students data is correct
    console.log('students data:', students);
  
    try {
      await storePaymentDetails();
      await axios.post(`http://localhost:5003/api/studentfee`, {
        email: students.email,
        ...students,
        transport_fees: 0, // Set transport_fees to 0 after payment
      });
  
      console.log(`Payment processed for ${students.name}: ₹${amountToPay} (${paymentType} payment)`);
    
      navigate('/admin', { state: { key: students.email } });
    } catch (error) {
      console.error('Error processing payment:', error);
  
      // Additional debugging
      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
    }
  };

  return (
    <div className="payment-container">
      <h1>Payment Details</h1>
      <div className="students-details">
        <p><strong>Name:</strong> {students.name}</p>
        <p><strong>Reg No:</strong> {students.regno}</p>
        <p><strong>Fee Type:</strong> Transport Fee</p>
        <p><strong>Total Amount:</strong> ₹{students.transport_fees || 0}</p>
      </div>
      <form onSubmit={handlePaymentSubmit} className="payment-form">
        <div className="form-group">
          <label>Payment Type:</label>
          <select value={paymentType} onChange={handlePaymentTypeChange}>
            <option value="full">Full Payment</option>
          </select>
        </div>
        <div className="amount-due">
          <p><strong>Amount to Pay:</strong> ₹{amountToPay}</p>
        </div>
        <button type="submit" className="pay-button">Generate Payment Receipt</button>
        <button type="button" className="cancel-button">Cancel</button>
      </form>
    </div>
  );
};

export default TransportFeesPage;
