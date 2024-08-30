import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './FeesPage.css';

const TuitionFeesPage = () => {
  const location = useLocation();
  const student = location.state?.student || {};
  const [paymentType, setPaymentType] = useState('full'); 
  const [amountToPay, setAmountToPay] = useState(student.tuitionFees);

  useEffect(() => {
    if (paymentType === 'half') {
      setAmountToPay(student.tuitionFees / 2);
    } else {
      setAmountToPay(student.tuitionFees);
    }
  }, [paymentType, student.tuitionFees]);

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    console.log(`Processing payment for ${student.name}: ₹${amountToPay} (${paymentType} payment)`);
    // Add your payment processing logic here
  };

  return (
    <div className="payment-container">
      <h2>Payment Details</h2>
      <div className="student-details">
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Reg No:</strong> {student.regNo}</p>
        <p><strong>Fee Type:</strong> Tuition Fee</p>
        <p><strong>Total Amount:</strong> ₹{student.tuitionFees}</p>
      </div>
      <form onSubmit={handlePaymentSubmit} className="payment-form">
        <div className="form-group">
          <label>Payment Type:</label>
          <select value={paymentType} onChange={handlePaymentTypeChange}>
            <option value="full">Full Payment</option>
            <option value="half">Half Payment</option>
          </select>
        </div>
        <div className="amount-due">
          <p><strong>Amount to Pay:</strong> ₹{amountToPay}</p>
        </div>
        <button type="submit" className="pay-button">Generate Payment</button>
        <button type="button" className="cancel-button" onClick={() => console.log('Payment canceled')}>Cancel</button>
      </form>
    </div>
  );
};

export default TuitionFeesPage;
