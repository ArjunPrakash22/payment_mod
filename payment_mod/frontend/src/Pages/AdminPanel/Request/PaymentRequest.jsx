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
    const handlePaymentStatusUpdate = async (request) => {
        try {
            await axios.put(`http://localhost:5003/api/updatepaymentrequestaspaid`, {
                status: 'paid',
            });
            setRequestList((prevList) =>
                prevList.map((item) =>
                    item.admission_number === request.admission_number
                        ? { ...item, status: 'paid' }
                        : item
                )
            );
        } catch (error) {
            console.error('Error verifying payment:', error);
            alert('Failed to verify payment.');
        }
    };


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
                        </tr>
                    </thead>
                    <tbody>
                        {requestList.length ? (
                            requestList.map((payment_request, index) => (
                                <tr key={index} className="tr">
                                    <td className="td">{payment_request.bill_no}</td>
                                    <td className="td">{payment_request.admission_no}</td>
                                    <td className="td">{payment_request.regno}</td>
                                    <td className="td">{payment_request.name}</td>
                                    <td className="td">{payment_request.email}</td>
                                    <td className="td">{payment_request.phone_no}</td>
                                    <td className="td">{payment_request.cash_mode}</td>
                                    <td className="td">{payment_request.transaction_id}</td>
                                    <td className="td">{payment_request.transaction_date}</td>
                                    <td className="td">{payment_request.fee_type}</td>
                                    <td className="td">₹{payment_request.amount}</td>
                                    <td className="td">{payment_request.status}</td>
                                    <td className="td">
                                        {payment_request.status === 'pending' ? (
                                            <button
                                                className="verify-button"
                                                onClick={() => handlePaymentStatusUpdate(payment_request)}
                                            >
                                                Verify
                                            </button>
                                        ) : (
                                            <span>Verified</span>
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
