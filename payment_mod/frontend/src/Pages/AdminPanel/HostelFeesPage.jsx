import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FeesPage.css';

const HostelFeesPage = () => {
  const location = useLocation();
  const students = location.state?.students || {};
  //const { studentss } = location.state;
  const [paymentType, setPaymentType] = useState('full'); 
  const [amountToPay, setAmountToPay] = useState(students.hostel_fees);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const navigate = useNavigate();

  useEffect(() => {
  setAmountToPay(students.hostel_fees);
    }, [paymentType, students.hostel_fees]);
  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
    setPaymentMode(e.target.value);
  };


  const Download_Hostel= async () => {
    try {
      const response = await axios.post(
        "http://localhost:5003/api/download_receipt",
        { email: students.email,
          amount: amountToPay,
          feestype: 'Hostel',
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
      a.setAttribute('download', 'Hostel_receipt.pdf');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading the PDF:', error);
    }
  };


  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5003/api/studentfee`, {email:students.email,
        ...students,
        hostel_fees: 0,
      });

      console.log(`Payment processed for ${students.name}: ₹${amountToPay} (${paymentType} payment)`);
      await Download_Hostel();
      // Redirect back to the admin panel
      navigate('/admin', {
        state: { key: "SsSaDmin153@gmail.com" },
        replace: true,
      });

      // Prevent back navigation
      window.history.pushState(null, null, window.location.href);
      window.addEventListener('popstate', function(event) {
        window.history.pushState(null, null, window.location.href);
      });
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  return (
    <div className="payment-container">
      <h1>Payment Details</h1>
      <div className="students-details">
        <p><strong>Name:</strong> {students.name}</p>
        <p><strong>Reg No:</strong> {students.regno}</p>
        <p><strong>Fee Type:</strong> Hostel Fee</p>
        <p><strong>Total Amount:</strong> ₹{students.hostel_fees}</p>
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

export default HostelFeesPage;
