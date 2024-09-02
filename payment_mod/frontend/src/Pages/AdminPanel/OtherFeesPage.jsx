import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './FeesPage.css';

const OtherFeesPage = () => {
  const location = useLocation();
  const student = location.state?.student || {};
  //const { student } = location.state;
  const [paymentType, setPaymentType] = useState('full'); 
  const [amountToPay, setAmountToPay] = useState(student.otherFees);

  useEffect(() => {
  setAmountToPay(student.otherFees);
    }, [paymentType, student.otherFees]);
  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    console.log(`Processing payment for ${student.name}: ${amountToPay} (${paymentType} payment)`);
    // Add your payment processing logic here
  };

  return (
    <div className="payment-container">
      <h1>Payment Details</h1>
      <div className="student-details">
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Reg No:</strong> {student.regNo}</p>
        <p><strong>Fee Type:</strong> Other Fee</p>
        <p><strong>Total Amount:</strong> ₹{student.otherFees}</p>
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
        <button type="submit" className="pay-button">Generate Payment</button>
        <button type="button" className="cancel-button" onClick={() => console.log('Payment canceled')}>Cancel</button>

      </form>
    </div>
  );
};

export default OtherFeesPage;
