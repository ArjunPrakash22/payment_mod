import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Dashboard.css';
import clglogo from '../../Assets/pictures/logo.png';
import axios from 'axios';

const Dashboard = () => {
  const [student, setStudent] = useState({});
  const location = useLocation();
  const { key } = location.state || {}; // Extract 'key' from location.state

  useEffect(() => {
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
        <img className="clg-logo" src={clglogo} alt="clg-logo" />
      </div>
      <h2>Student Dashboard</h2>
      <div className="student-info">
        <p><strong>Admission No:</strong> {student.admission_no}</p>
        <p><strong>Registration No:</strong> {student.regno}</p>
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Gender:</strong> {student.gender}</p>
        <p><strong>Date of Birth:</strong> {student.dob}</p>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Phone No:</strong> {student.phone_no}</p>
        <p><strong>Aadhar No:</strong> {student.aadhar_no}</p>
        <p><strong>Govt School:</strong> {student.govt_school}</p>
        <p><strong>Course Name:</strong> {student.course_name}</p>
        <p><strong>Batch Year:</strong> {student.batchyr}</p>
        <p><strong>Quota:</strong> {student.quota}</p>
        <p><strong>College Fees:</strong> {student.clg_fees}</p>
        <p><strong>Hosteller:</strong> {student.hosteller}</p>
        <p><strong>Hostel Fees:</strong> {student.hostel_fees}</p>
        <p><strong>Tuition Fees:</strong> {student.tuition_fees}</p>
        <p><strong>Miscellaneous Fees:</strong> {student.miscellaneous_fees}</p>
        <p><strong>Reason:</strong> {student.reason}</p>
        <p><strong>Transport Fees:</strong> {student.transport_fees}</p>
        <p><strong>Exam Fees:</strong> {student.exam_fees}</p>
      </div>
    </div>
  );
};

export default Dashboard;
