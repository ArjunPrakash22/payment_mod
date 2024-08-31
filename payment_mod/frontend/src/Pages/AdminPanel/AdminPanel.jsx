import React, { useState } from 'react';
import './AdminPanel.css';
import axios from "axios";

const AdminPanel = () => {

  const Download_hostel = async () => {
    try {
        // Post request to fetch the PDF
        const response = await axios.post(
            "http://localhost:5003/api/download_hostel_receipt",
            {},
            {
                responseType: "blob", // Specify responseType as 'blob' to receive binary data
            }
        );

        // Create a URL for the blob object
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create a link element and trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', 'hostel_receipt.pdf'); // Specify the filename
        document.body.appendChild(a);
        a.click();

        // Remove the link element and clean up the temporary URL
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error downloading the PDF:', error);
    }
};


  const [searchTerm, setSearchTerm] = useState("");
  const students = [
    {
      name: "John Doe",
      regNo: "123456",
      parentName: "Jane Doe",
      aadhar: "1234-5678-9101",
      email: "john@example.com",
      phone: "9876543210",
      address: "123 Main St, City",
      hosteller: true,
      yearOfStudy: "3rd Year",
      batch: "2021-2025",
      hostelFees: "50000",
      collegeFees: "200000",
      tuitionFees: "100000",
      otherFees: "15000",
      status: "Paid"
    },
  
  ];


  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.aadhar.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.yearOfStudy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-panel">
      <h1>Student Information</h1>
      <button className='download-btn' onClick={Download_hostel}>Download</button>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Reg No</th>
            <th>Parent Name</th>
            <th>Aadhar Number</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Hosteller/Dayscholar</th>
            <th>Year of Study</th>
            <th>Batch</th>
            <th>Hostel Fees</th>
            <th>College Fees</th>
            <th>Tuition Fees</th>
            <th>Other Fees</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.name}</td>
                <td>{student.regNo}</td>
                <td>{student.parentName}</td>
                <td>{student.aadhar}</td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
                <td>{student.address}</td>
                <td>{student.hosteller ? "Hosteller" : "Dayscholar"}</td>
                <td>{student.yearOfStudy}</td>
                <td>{student.batch}</td>
                <td>{student.hosteller ? student.hostelFees : "N/A"}</td>
                <td>{student.collegeFees}</td>
                <td>{student.tuitionFees}</td>
                <td>{student.otherFees}</td>
                <td>{student.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="15" className="no-data">No matching records found</td>
            </tr>
          )}
        </tbody>
      </table>
      
    </div>
  );
}

export default AdminPanel;
