import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ExamFeeRequests.css'; // Optional, for styling

const ExamFeeRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('http://localhost:5003/api/display-examfee-requests');
                setRequests(response.data);
            } catch (err) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleTransactionUpdate = async (request, action) => {
        try {
            const { name, regno, email, type, mode, amount, no_of_subjects, transaction_id, transaction_date, transaction_time, billno } = request;

            // If action is "add", add to exam fee
            if (action === 'add') {
                await axios.post('http://localhost:5003/api/examfee/record', {
                    name,
                    regno,
                    email,
                    type,
                    mode,
                    amount,
                    no_of_subjects,
                    transaction_id,
                    transaction_date,
                    transaction_time
                });
                alert('Exam fee record added!');
            }

            // Update the status in the payment request table
            const status = action === 'add' ? 'verified' : 'rejected';
            await axios.put(`http://localhost:5003/api/payment-request/${transaction_id}`, { status });

            alert(`Payment request status updated to ${status}!`);

            // Refresh requests after the update
            const response = await axios.get('http://localhost:5003/api/display-examfee-requests');
            setRequests(response.data);

        } catch (err) {
            alert('Error updating payment request: ' + (err.response?.data?.error || err.message));
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="exam-fee-requests">
            <h1>Exam Fee Requests</h1>
            <table>
                <thead>
                    <tr>
                        <th>Bill No</th>
                        <th>Name</th>
                        <th>Reg No</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Mode</th>
                        <th>Amount</th>
                        <th>No of Subjects</th>
                        <th>Transaction ID</th>
                        <th>Transaction Date</th>
                        <th>Transaction Time</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(request => (
                        <tr key={request.billno}>
                            <td>{request.billno}</td>
                            <td>{request.name}</td>
                            <td>{request.regno}</td>
                            <td>{request.email}</td>
                            <td>{request.type}</td>
                            <td>{request.mode}</td>
                            <td>{request.amount}</td>
                            <td>{request.no_of_subjects}</td>
                            <td>{request.transaction_id}</td>
                            <td>{request.transaction_date}</td>
                            <td>{request.transaction_time}</td>
                            <td>{request.status}</td>
                            <td>
                                {request.status !== 'verified' && request.status !== 'rejected' && (
                                    <>
                                        <button onClick={() => handleTransactionUpdate(request, 'add')}>Add to Exam Fee</button>
                                        <button onClick={() => handleTransactionUpdate(request, 'reject')}>Reject Transaction</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExamFeeRequests;
