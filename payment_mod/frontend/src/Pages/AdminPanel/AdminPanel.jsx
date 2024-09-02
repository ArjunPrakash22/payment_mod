import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AdminPanel.css';

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


  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editStudent, setEditStudent] = useState(null);
  const [formData, setFormData] = useState({});
const navigate = useNavigate();

const handleTuitionPayNowClick = (student) => {
  navigate('/tuition-fees', { state: { student } });
};
const handleHostelPayNowClick = (student) => {
  navigate('/hostel-fees', { state: { student } });
};
const handleOtherPayNowClick = (student) => {
  navigate('/other-fees', { state: { student } });
};
const handleCollegePayNowClick = (student) => {
  navigate('/college-fees', { state: { student } });
};


  useEffect(() => {
    axios.get('http://localhost:5000/api/students')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.regNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (student) => {
    setEditStudent(student);
    setFormData({ ...student });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("inside handle submit");
    console.log('Submitting form data:', formData);
    axios.put(`http://localhost:5000/api/students/${formData.regNo}`, formData)
      .then(response => {
        console.log('Update successful:', response.data);
    
        axios.get('http://localhost:5000/api/students')
          .then(response => {
            console.log('Fetched updated data:', response.data);
            setStudents(response.data);
          })
          .catch(error => {
            console.error("There was an error fetching the data!", error);
          });
  
        setEditStudent(null);
      })
      .catch(error => {
        console.error("There was an error updating the data!", error);
      });
  };

  return (
    <div className="admin-panel">
      <h1>Student Information</h1>

      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="content-container">
        <div className="table-container">
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
                <th>Edit</th>
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
                    <td>{student.hosteller ? student.hostelFees : "N/A"}
                    <Link to="/hostel-fees" state={{ student }}><button onClick={() => handleHostelPayNowClick(student)}>Pay Now</button></Link>
                    </td>
                    <td>{student.collegeFees}
                    <Link to="/college-fees" state={{ student }}><button onClick={() => handleCollegePayNowClick(student)}>Pay Now</button></Link>
                    </td>
                    <td>{student.tuitionFees}
                    <Link to="/tuition-fees" state={{ student }}><button onClick={() => handleTuitionPayNowClick(student)}>Pay Now</button></Link>
                    </td>
                    <td>{student.otherFees}
                    <Link to="/other-fees" state={{ student }}><button onClick={() => handleOtherPayNowClick(student)}>Pay Now</button></Link>
                    </td>
                    <td>{student.status}</td>
                    <td>
                      <button onClick={() => handleEditClick(student)}>Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="16" className="no-data">No matching records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {editStudent && (
          <div className="edit-section">
            <div className="edit-form">
              <h2>Edit Student Information</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Reg No:</label>
                    <input
                      type="text"
                      name="regNo"
                      value={formData.regNo || ''}
                      onChange={handleChange}
                      disabled
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Parent Name:</label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Aadhar Number:</label>
                    <input
                      type="text"
                      name="aadhar"
                      value={formData.aadhar || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number:</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Address:</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Hosteller:</label>
                    <input
                      type="checkbox"
                      name="hosteller"
                      checked={formData.hosteller || false}
                      onChange={e => setFormData({ ...formData, hosteller: e.target.checked })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Year of Study:</label>
                    <input
                      type="text"
                      name="yearOfStudy"
                      value={formData.yearOfStudy || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Batch:</label>
                    <input
                      type="text"
                      name="batch"
                      value={formData.batch || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Hostel Fees:</label>
                    <input
                      type="number"
                      name="hostelFees"
                      value={formData.hostelFees || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>College Fees:</label>
                    <input
                      type="number"
                      name="collegeFees"
                      value={formData.collegeFees || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tuition Fees:</label>
                    <input
                      type="number"
                      name="tuitionFees"
                      value={formData.tuitionFees || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Other Fees:</label>
                    <input
                      type="number"
                      name="otherFees"
                      value={formData.otherFees || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Status:</label>
                    <input
                      type="text"
                      name="status"
                      value={formData.status || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <button type="submit">Update</button>
                <button type="button" onClick={() => setEditStudent(null)}>Cancel</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
