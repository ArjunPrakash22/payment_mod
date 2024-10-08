import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FeesPage.css';

const RegistrationFeesPage = () => {
  const location = useLocation();
  const students = location.state?.students || {};
  const [paymentType, setPaymentType] = useState('full'); 
  const [amountToPay, setAmountToPay] = useState(students.reg_fees);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const navigate = useNavigate();

  useEffect(() => {
    setAmountToPay(students.reg_fees);
  }, [paymentType, students.reg_fees]);

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
    setPaymentMode(e.target.value);
  };
  const Download_registration= async () => {
    try {
      const response = await axios.post(
        "http://localhost:5003/api/download_receipt",
        { email: students.email,
          amount: students.reg_fees,
          feestype: 'Registration',
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
      a.setAttribute('download', 'Registration_receipt.pdf');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading the PDF:', error);
    }
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
        feeType: 'Registration Fee',
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
  
    // Ensure student data is correct
    console.log('Student data:', students);
  
    try {

      
      await storePaymentDetails();
      await axios.post(`http://localhost:5003/api/studentfee`, {email:students.email,
        ...students,
        reg_fees: 0,
      });
  
      console.log(`Payment processed for ${students.name}: ₹${amountToPay} (${paymentType} payment)`);
       await Download_registration();
      navigate('/admin',{state:{key:"SsSaDmin153@gmail.com"},
      replace:true,
    });
    // Prevent back navigation
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', function(event) {
      window.history.pushState(null, null, window.location.href);
    });
    } catch (error) {
      console.error('Error processing payment:', error);
  
      // Additional debugging
      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
    }
};


const handleCancel = () => {
  // Redirect back to the admin panel
  navigate('/admin');
};
  

  return (
    <div className="payment-container">
      <h1>Payment Details</h1>
           <div className="students-details">
              <p><strong>Name:</strong> {students.name}</p>
              <p><strong>Reg No:</strong> {students.regno}</p>
              <p><strong>Fee Type:</strong> Registration Fee</p>
              <p><strong>Total Amount:</strong> ₹{students.reg_fees}</p>
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
          <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>

      </form>
      </div>
  );
};

export default RegistrationFeesPage;
