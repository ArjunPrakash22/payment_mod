import React, { useState, useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import './Dashboard.css';
import clglogo from '../../Assets/pictures/logo.png';
import axios from 'axios';

const Dashboard = () => {
  const [student, setStudent] = useState({});
  const location = useLocation();
  const navigate=useNavigate();
  const { key } = location.state || {}; // Extract 'key' from location.state

  useEffect(() => {

    if (!location.state || !location.state.key) {
      // If the key is missing, redirect to the login page
      navigate('/');
    }
  ;
    async function fetchData() {
      try {
        if (key) {
          // Fetch student details using the key (assuming the key is email)
          const response = await axios.post('http://localhost:5003/api/dashboard/', {
            studentEmail: key,
          });

          console.log('Student data fetched:', response.data);
          setStudent(response.data);
        } else {
          console.warn('No key provided in location.state');
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    }

    fetchData();
  }, [key]);

  return (
    <div className="dashboard">
      <div className="logo text-center">
        <img className='clg-logo' src={clglogo} alt='clg-logo'/>
        <h2 className='h2'>SUDHA SASEENDRAN SIDDHA MEDICAL COLLEGE AND HOSPITAL</h2>
        <p>Meecode, Kaliyakkavilai Post, Kanyakumari District -
        629153</p>
      </div>
      <h2>Student Dashboard</h2>
      <div className="student-info"><br/>
      <h1 style={{ color: '#17a462', display: 'block', marginBottom: '20px' }}>Personal Details</h1><br/>

        <p><strong>Admission No:</strong> {student.admission_no}</p>
        <p><strong>Registration No:</strong> {student.regno}</p>
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Gender:</strong> {student.gender}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Phone No:</strong> {student.phone_no}</p>
        <p><strong>Aadhar No:</strong> {student.aadhar_no}</p>
        <p><strong>DOB:</strong> {student.dob}</p>
        <p><strong>Batch Year:</strong> {student.batchyr}</p>
        <br/>
        <div><h1 style={{ color: '#17a462', display: 'block', marginBottom: '20px' }}>College Details</h1><br/></div><br/>

        <p><strong>Course Name:</strong> {student.course_name}</p>
      
        <p><strong>College Fees:</strong> {student.clg_fees}</p>
        <p><strong>Hosteller:</strong> {student.hosteller}</p>
        <p><strong>Hostel Fees:</strong> {student.hostel_fees}</p>
        <p><strong>Tuition Fees:</strong> {student.tuition_fees}</p>
        <p><strong>Transport Fees:</strong> {student.transport_fees}</p>
        <p><strong>Exam Fees:</strong> {student.exam_fees}</p>
        <p><strong>Miscellaneous Fees:</strong> {student.miscellaneous_fees}</p>
        <p><strong>Reason:</strong> {student.reason}</p>
      </div>
    </div>
  );
};

export default Dashboard;
