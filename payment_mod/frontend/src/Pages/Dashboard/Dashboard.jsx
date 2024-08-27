import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [student, setStudent] = useState({
    name: 'faji',
    department: 'Computer Science',
    idNumber: 'CS123456',
    dob: '2000-01-10',
    place: 'Karaikudi',
    previousStatus: 'Passed',
    dueFees: 5000,
  });

  const [fees, setFees] = useState([
    { type: 'Tuition Fees (Full)', amount: 3000 },
    { type: 'Hostel Fees', amount: 2000 },
    { type: 'Transport Fees', amount: 1000 },
  ]);

  const [selectedFees, setSelectedFees] = useState([]);
  const [newFeeType, setNewFeeType] = useState('');
  const [newFeeAmount, setNewFeeAmount] = useState('');

  const handleFeeSelection = (e, feeType, feeAmount) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedFees([...selectedFees, { type: feeType, amount: feeAmount }]);
    } else {
      setSelectedFees(selectedFees.filter(fee => fee.type !== feeType));
    }
  };

  const addManualFee = () => {
    if (newFeeType && newFeeAmount) {
      const manualFee = { type: newFeeType, amount: parseInt(newFeeAmount) };
      setFees([...fees, manualFee]);
      setSelectedFees([...selectedFees, manualFee]);
      setNewFeeType('');
      setNewFeeAmount('');
    }
  };

  return (
    <div className="dashboard">
      <h2>Student Dashboard</h2>
      <div className="student-info">
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Department:</strong> {student.department}</p>
        <p><strong>ID Number:</strong> {student.idNumber}</p>
        <p><strong>Date of Birth:</strong> {student.dob}</p>
        <p><strong>Place:</strong> {student.place}</p>
        <p><strong>Previous Status:</strong> {student.previousStatus}</p>
        <p><strong>Due Fees:</strong> ₹{student.dueFees}</p>
      </div>

      <div className="fees-section">
        <h3>Select Fees to Pay</h3>
        <form>
          {fees.map((fee, index) => (
            <div key={index} className="fee-option">
              <input
                type="checkbox"
                id={`fee-${index}`}
                onChange={(e) => handleFeeSelection(e, fee.type, fee.amount)}
              />
              <label htmlFor={`fee-${index}`}>
                {fee.type} - ₹{fee.amount}
              </label>
            </div>
          ))}
        </form>

        <div className="add-fee">
          <h4>Add Additional Fees</h4>
          <input
            type="text"
            placeholder="Enter Fee Type"
            value={newFeeType}
            onChange={(e) => setNewFeeType(e.target.value)}
          />
          <input
            type="number"
            placeholder="Enter Fee Amount"
            value={newFeeAmount}
            onChange={(e) => setNewFeeAmount(e.target.value)}
          />
          <button type="button" onClick={addManualFee}>Add Fee</button>
        </div>

        <div className="selected-fees">
          <h4>Selected Fees:</h4>
          <ul>
            {selectedFees.map((fee, index) => (
              <li key={index}>
                {fee.type} - ₹{fee.amount}
              </li>
            ))}
          </ul>
        </div>
      </div>

      
    </div>
  );
};

export default Dashboard;
