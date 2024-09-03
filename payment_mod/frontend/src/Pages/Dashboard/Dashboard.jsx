import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Dashboard.css';
import clglogo from '../../Assets/pictures/logo.png'
import axios from 'axios';


const Dashboard = () => {
  const [student, setStudent] = useState({});
  const location = useLocation();
  const { key } = location.state || {}; // Extract 'key' from location.state

  useEffect(() => {
    async function fetchData() {
      try {
        if (key) {

          // Fetch student details using the key
          const response = await axios.post('http://localhost:5003/api/dashboard/', {
            studentEmail: key, // Assuming 'key' is the email
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
      </div>
      <h2>Student Dashboard</h2>
      <div className="student-info">
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Department:</strong> {student.department}</p>
        <p><strong>ID Number:</strong> {student.idNumber}</p>
        <p><strong>Date of Birth:</strong> {student.dob}</p>
        <p><strong>Place:</strong> {student.place}</p>
        <p><strong>Previous Status:</strong> {student.previousStatus}</p>
      </div>

      {/* <div className="fees-section">
        <h3>Due Fees</h3>
        <p>Total Due Fees: ₹{totalDueFees.toFixed(2)}</p>

        <button className="pay-now-button">
          Pay Now
        </button>
      </div> */}
    </div>
  );
};

export default Dashboard;