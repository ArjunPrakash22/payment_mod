import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PaymentRequest.css';

const RequestTable = () => {
    const [requestList, setRequestList] = useState([]);
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.post('http://localhost:5003/api/displaypaymentrequest');
                setRequestList(response.data);
            } catch (error) {
                console.error('Error fetching payment requests:', error);
            }finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);
    const handlePaymentStatusUpdate = async (request,action) => {
        try {
            const {admission_no,name, regno, email,phone_no ,fee_type, cash_mode, transaction_id, transaction_date,amount  } = request;

            // If action is "add", add to exam fee
            if (action === 'add') {
                await axios.post('http://localhost:5003/api/storeinpaymentrequestdb', {

                    admission_no,
                    name,
                    regno,
                    email,
                    phone_no,
                    fee_type,
                    cash_mode,
                    transaction_id,
                    transaction_date,
                    amount
                });
                alert('Payment Request fee record added!');
            }

            // Update the status in the payment request table
            const status = action === 'add' ? 'verified' : 'rejected';
            await axios.post(`http://localhost:5003/api/updatepaymentrequestaspaid/${transaction_id}`, { status });

            alert(`Payment request status updated to ${status}!`);

            

            // Refresh requests after the update
            // const response = await axios.post(`http://localhost:5003/api/displaypaymentrequest`);
            // setRequests(response.data);

        } catch (err) {
            alert('Error updating payment request: ' + (err.response?.data?.error || err.message));
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="request-table-container">
            <h1 className="h1">Payment Requests</h1>
            <div className="button-container">
                <button className="history-button" onClick={() => navigate('/admin')}>
                    Admin Panel
                </button>
                <button className="history-button" onClick={() => navigate('/payment-history')}>
                    Payment History
                </button>
            </div>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr className="tr">
                            <th className="th">Bill No</th>
                            <th className="th">Admission Number</th>
                            <th className="th">Registration Number</th>
                            <th className="th">Name</th>
                            <th className="th">Email</th>
                            <th className="th">Phone Number</th>
                            <th className="th">Payment Mode</th>
                            <th className="th">Transaction ID</th>
                            <th className="th">Transaction Date</th>
                            <th className="th">Fee Type</th>
                            <th className="th">Amount</th>
                            <th className="th">Status</th>
                            <th className="th">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requestList.length ? (
                            requestList.map((request, index) => (
                                <tr key={index} className="tr">
                                    <td className="td">{request.bill_no}</td>
                                    <td className="td">{request.admission_no}</td>
                                    <td className="td">{request.regno}</td>
                                    <td className="td">{request.name}</td>
                                    <td className="td">{request.email}</td>
                                    <td className="td">{request.phone_no}</td>
                                    <td className="td">{request.cash_mode}</td>
                                    <td className="td">{request.transaction_id}</td>
                                    <td className="td">{request.transaction_date}</td>
                                    <td className="td">{request.fee_type}</td>
                                    <td className="td">₹{request.amount}</td>
                                    <td className="td">{request.status}</td>
                                    <td>
                                {request.status !== 'verified' && request.status !== 'rejected' && (
                                    <>
                                        <button onClick={() => handlePaymentStatusUpdate(request, 'add')}>Add to Payment History</button>
                                        <button onClick={() => handlePaymentStatusUpdate(request, 'reject')}>Reject Transaction</button>
                                    </>
                                )}
                            </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="no-data">No payment requests found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RequestTable;