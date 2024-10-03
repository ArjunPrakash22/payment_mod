import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import clglogo from '../../Assets/pictures/logo.png';
import axios from 'axios';

const Dashboard = () => {
  const [student, setStudent] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { key } = location.state || {}; // Extract 'key' from location.state

  useEffect(() => {
    if (!location.state || !location.state.key) {
      navigate('/');
    }

    async function fetchData() {
      try {
        if (key) {
          const response = await axios.post('http://localhost:5003/api/dashboard/', {
            studentEmail: key,
          });
          setStudent(response.data);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    }

    fetchData();
  }, [key]);

  const handlePayNow = async (feeType, amount) => {
    try {
      const response = await axios.post('http://localhost:5003/api/storepaymentrequest', {
      admissionNo: student.admission_no,
      name: student.name,
      regno: student.regno,
      email: student.email,
      phone_no: student.phone_no,
      feeType: feeType,
      amount: amount,
      cash_mode: 'online',
      });
      navigate('/qr-payment', { state: { feeType, amount, studentEmail: student.email } });
    } catch (error) {
      console.error('Error sending payment request:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="header text-center">
        <img className="clg-logo" src={clglogo} alt="College Logo" />
        <h2>SUDHA SASEENDRAN SIDDHA MEDICAL COLLEGE AND HOSPITAL</h2>
        <p>Meecode, Kaliyakkavilai Post, Kanyakumari District - 629153</p>
      </div>
      <h2>Student Dashboard</h2>

      {/* Personal Details Section */}
      <h1 style={{ color: '#17a462', display: 'block', marginBottom: '20px' }}>Personal Details</h1>
      <div className="cards-container">
        <div className="card">
          <p><strong>Admission No:</strong> {student.admission_no}</p>
        </div>
        <div className="card">
          <p><strong>Registration No:</strong> {student.regno}</p>
        </div>
        <div className="card">
          <p><strong>Name:</strong> {student.name}</p>
        </div>
        <div className="card">
          <p><strong>Gender:</strong> {student.gender}</p>
        </div>
        <div className="card">
          <p><strong>Email:</strong> {student.email}</p>
        </div>
        <div className="card">
          <p><strong>Phone No:</strong> {student.phone_no}</p>
        </div>
        <div className="card">
          <p><strong>Aadhar No:</strong> {student.aadhar_no}</p>
        </div>
        <div className="card">
          <p><strong>DOB:</strong> {student.dob}</p>
        </div>
        <div className="card">
          <p><strong>Batch Year:</strong> {student.batchyr}</p>
        </div>
      </div>

      {/* Add a small gap between the two sections */}
      <div className="section-gap"></div>

      {/* College Details Section */}
      <h1 style={{ color: '#17a462', display: 'block', marginBottom: '20px' }}>College Details</h1>
      <div className="cards-container">
        <div className="card">
          <p><strong>Course Name:</strong> {student.course_name}</p>
        </div>
        <div className="card">
          <p><strong>Hosteller:</strong> {student.hosteller}</p>
        </div>
        <div className="card">
          <p><strong>Hostel Fees:</strong> {student.hostel_fees}</p>
          <button onClick={() => handlePayNow('Hostel Fees', student.hostel_fees)}>Pay Hostel Fees</button>
        </div>
        <div className="card">
          <p><strong>Tuition Fees:</strong> {student.tuition_fees}</p>
          <button onClick={() => handlePayNow('Tuition Fees', student.tuition_fees)}>Pay Tuition Fees</button>
        </div>
        <div className="card">
          <p><strong>Transport Fees:</strong> {student.transport_fees}</p>
          <button onClick={() => handlePayNow('Transport Fees', student.transport_fees)}>Pay Transport Fees</button>
        </div>
        <div className="card">
          <p><strong>Caution Deposit:</strong> {student.caution_deposit}</p>
          <button onClick={() => handlePayNow('Caution Deposit', student.caution_deposit)}>Pay Caution Deposit</button>
        </div>
        <div className="card">
          <p><strong>College Fees:</strong> {student.clg_fees}</p>
          <button onClick={() => handlePayNow('College Fees', student.clg_fees)}>Pay College Fees</button>
        </div>
        <div className="card">
          <p><strong>Exam Fees:</strong> {student.exam_fees}</p>
          <button onClick={() => handlePayNow('Exam Fees', student.exam_fees)}>Pay Exam Fees</button>
        </div>
        <div className="card">
          <p><strong>Registration Fees:</strong> {student.reg_fees}</p>
          <button onClick={() => handlePayNow('Registration Fees', student.reg_fees)}>Pay Registration Fees</button>
        </div>
        <div className="card">
          <p><strong>Miscellaneous Fees:</strong> {student.miscellaneous_fees}</p>
          <button onClick={() => handlePayNow('Registration Fees', student.reg_fees)}>Pay Miscellaneous Fees</button>
        </div>
      </div>

      {/* Display the reason if available */}
      <div className="cards-container">
        <div className="card">
          <p><strong>Reason:</strong> {student.reason}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
