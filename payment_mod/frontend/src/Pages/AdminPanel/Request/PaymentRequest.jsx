import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PaymentRequest.css';

const RequestTable = () => {
    const [requestList, setRequestList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.post('http://localhost:5003/api/displaypaymentrequest');
                setRequestList(response.data);
            } catch (error) {
                console.error('Error fetching payment requests:', error);
            }
        };
        fetchRequests();
    }, []);

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
                            <th className="th">Admission Number</th>
                            <th className="th">Registration Number</th>
                            <th className="th">Name</th>
                            <th className="th">Email</th>
                            <th className="th">Phone Number</th>
                            <th className="th">Payment Mode</th>
                            <th className="th">Fee Type</th>
                            <th className="th">Amount</th>
                            <th className="th">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requestList.length ? (
                            requestList.map((request, index) => (
                                <tr key={index} className="tr">
                                    <td className="td">{request.admission_number}</td>
                                    <td className="td">{request.regno}</td>
                                    <td className="td">{request.name}</td>
                                    <td className="td">{request.email}</td>
                                    <td className="td">{request.phone_no}</td>
                                    <td className="td">{request.payment_mode}</td>
                                    <td className="td">{request.fee_type}</td>
                                    <td className="td">₹{request.amount}</td>
                                    <td className="td">{request.status}</td>
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
