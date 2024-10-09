import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditFeePage = () => {
  const [formData, setFormData] = useState({
    clg_fees: '',
    hostel_fees: '',
    tuition_fees: '',
    miscellaneous_fees: '',
    reason: '',
    transport_fees: '',
    reg_fees: '',
    caution_deposit: '',
  });

  const [quotaType, setQuotaType] = useState('Govt'); // State to handle dropdown selection

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleQuotaChange = (e) => {
    setQuotaType(e.target.value); // Update the quota type
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:5003/api/update-fees', {
            // You don't need to specify method and headers in the request body.
            // Axios automatically sets the Content-Type based on the data being sent.
            ...formData,
            quotaType, // Sending form data and quotaType
        });

        // Axios automatically throws an error for response status codes outside the range of 2xx.
        const result = response.data; // Get the response data
        const username="SsSaDmin153@gmail.com"
        console.log(result.message); // Display success message or handle as needed
        navigate('/admin',{state:{key:username}}); // Navigate to the admin page or wherever you need
    } catch (error) {
        console.error('Error:', error);
        // Optionally display an error message to the user
    }
};



  return (
    <div id="edit-section" className="edit-section">
      <div className="edit-form">
        <form onSubmit={handleSubmit}>

          {/* Quota Type Dropdown */}
          <div className="form-group">
            <label>Select Quota Type:</label>
            <select value={quotaType} onChange={handleQuotaChange}>
              <option value="Govt">Government Quota</option>
              <option value="Management">Management Quota</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>College Fees:</label>
              <input
                type="text"
                name="clg_fees"
                value={formData.clg_fees}
                onChange={handleChange}
                required // Making this field required
              />
            </div>
            <div className="form-group">
              <label>Hostel Fees:</label>
              <input
                type="text"
                name="hostel_fees"
                value={formData.hostel_fees}
                onChange={handleChange}
                required // Making this field required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tuition Fees ({quotaType} Quota):</label>
              <input
                type="text"
                name="tuition_fees"
                value={formData.tuition_fees}
                onChange={handleChange}
                required // Making this field required
              />
            </div>
            <div className="form-group">
              <label>Miscellaneous Fees:</label>
              <input
                type="text"
                name="miscellaneous_fees"
                value={formData.miscellaneous_fees}
                onChange={handleChange}
                required // Making this field required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Reason:</label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                // No required attribute here
              />
            </div>
            <div className="form-group">
              <label>Transport Fees:</label>
              <input
                type="text"
                name="transport_fees"
                value={formData.transport_fees}
                onChange={handleChange}
                required // Making this field required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Registration Fees:</label>
              <input
                type="text"
                name="reg_fees"
                value={formData.reg_fees}
                onChange={handleChange}
                required // Making this field required
              />
            </div>
            <div className="form-group">
              <label>Caution Deposit:</label>
              <input
                type="text"
                name="caution_deposit"
                value={formData.caution_deposit}
                onChange={handleChange}
                required // Making this field required
              />
            </div>
          </div>

          <button type="submit">Update Fees</button>
        </form>
      </div>
    </div>
  );
};

export default EditFeePage;
