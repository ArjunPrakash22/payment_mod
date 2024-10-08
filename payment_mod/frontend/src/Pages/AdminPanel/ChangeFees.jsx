
import React, { useState } from 'react';

const ChangeFees = () => {
    const [govFees, setGovFees] = useState({
        tuition: '',
        hostel: '',
        transport: '',
        college: '',
    });
    
    const [managementFees, setManagementFees] = useState({
        tuition: '',
        hostel: '',
        transport: '',
        college: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the fees update logic here (e.g., API call)
        console.log('Government Fees:', govFees);
        console.log('Management Fees:', managementFees);
        // Reset the form or provide feedback as needed
    };

    return (
        <div>
            <h1>Change Fees</h1>
            <form onSubmit={handleSubmit}>
                <h2>Government Quota Fees</h2>
                <label>
                    Tuition Fees:
                    <input 
                        type="number" 
                        value={govFees.tuition} 
                        onChange={(e) => setGovFees({ ...govFees, tuition: e.target.value })} 
                    />
                </label>
                <label>
                    Hostel Fees:
                    <input 
                        type="number" 
                        value={govFees.hostel} 
                        onChange={(e) => setGovFees({ ...govFees, hostel: e.target.value })} 
                    />
                </label>
                <label>
                    Transport Fees:
                    <input 
                        type="number" 
                        value={govFees.transport} 
                        onChange={(e) => setGovFees({ ...govFees, transport: e.target.value })} 
                    />
                </label>
                <label>
                    College Fees:
                    <input 
                        type="number" 
                        value={govFees.college} 
                        onChange={(e) => setGovFees({ ...govFees, college: e.target.value })} 
                    />
                </label>

                <h2>Management Quota Fees</h2>
                <label>
                    Tuition Fees:
                    <input 
                        type="number" 
                        value={managementFees.tuition} 
                        onChange={(e) => setManagementFees({ ...managementFees, tuition: e.target.value })} 
                    />
                </label>
                <label>
                    Hostel Fees:
                    <input 
                        type="number" 
                        value={managementFees.hostel} 
                        onChange={(e) => setManagementFees({ ...managementFees, hostel: e.target.value })} 
                    />
                </label>
                <label>
                    Transport Fees:
                    <input 
                        type="number" 
                        value={managementFees.transport} 
                        onChange={(e) => setManagementFees({ ...managementFees, transport: e.target.value })} 
                    />
                </label>
                <label>
                    College Fees:
                    <input 
                        type="number" 
                        value={managementFees.college} 
                        onChange={(e) => setManagementFees({ ...managementFees, college: e.target.value })} 
                    />
                </label>

                <button type="submit">Update Fees</button>
            </form>
        </div>
    );
};

export default ChangeFees;
