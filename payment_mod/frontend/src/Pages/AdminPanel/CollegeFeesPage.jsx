import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FeesPage.css';

const CollegeFeesPage = () => {
  const location = useLocation();
  const students = location.state?.students || {};
  const [paymentType, setPaymentType] = useState('full'); 
  const [amountToPay, setAmountToPay] = useState(students.clg_fees);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const navigate = useNavigate();

  useEffect(() => {
    setAmountToPay(students.clg_fees);
  }, [paymentType, students.clg_fees]);

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
    setPaymentMode(e.target.value);
  };


  const Download_College= async () => {
    try {
      const response = await axios.post(
        "http://localhost:5003/api/download_receipt",
        { email: students.email,
          amount: amountToPay,
          feestype: 'College',
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
      a.setAttribute('download', 'College_receipt.pdf');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading the PDF:', error);
    }
  };


  const handlePaymentSubmit = async (e) => {
    console.log('inside handlePaymentSubmit');
    e.preventDefault();
  
    // Ensure student data is correct
    console.log('Student data:', students);
  
    try {
      await axios.post(`http://localhost:5003/api/studentfee`, {email:students.email,
        ...students,
        clg_fees: 0, 
      });
  
      console.log(`Payment processed for ${students.name}: ₹${amountToPay} (${paymentType} payment)`);
      await Download_College();
      navigate('/admin',{state:{key:"SsSaDmin153@gmail.com"}});
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
              <p><strong>Reg No:</strong> {students.regNo}</p>
              <p><strong>Fee Type:</strong> College Fee</p>
              <p><strong>Total Amount:</strong> ₹{students.clg_fees}</p>
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

export default CollegeFeesPage;
