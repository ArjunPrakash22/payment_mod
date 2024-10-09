import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminPanel.css";

const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5003/api/payment-history"
        );
        setPaymentHistory(response.data);
      } catch (error) {
        console.error("Error fetching payment history:", error);
      }
    };
    fetchPaymentHistory();
  }, []);
  const username = "SsSaDmin153@gmail.com";

  const [pendingTransactionCount, setPendingTransactionCount] = useState(0);

  useEffect(() => {
    // Fetch pending transaction count from the server
    const fetchPendingTransactions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5003/api/pending-transactions-count"
        );
        setPendingTransactionCount(response.data.count);
      } catch (error) {
        console.error("Error fetching pending transactions count:", error);
      }
    };

    fetchPendingTransactions();
  }, []);
  return (
    <div className="payment-history-container">
      <div className="admin-panel">
        <h1 className="h1">Payment History</h1>
        <div className="button-container">
          <button
            className="history-button"
            onClick={() => navigate("/admin", { state: { key: username } })}
          >
            Admin Panel
          </button>
          <button
            className="history-button"
            onClick={() => navigate("/payment-request")}
          >
            Payment Requests
            {pendingTransactionCount > 0 && (
              <span className="notification-badge">
                {pendingTransactionCount}
              </span>
            )}
          </button>{" "}
          {/* Button to navigate to payment requests */}
        </div>
        <div className="content-container">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr className="tr">
                  <th className="th">Receipt Number</th>
                  <th className="th">Admission Number</th>
                  <th className="th">Reg No</th>
                  <th className="th">Name</th>
                  <th className="th">Email</th>
                  <th className="th">Phone No</th>
                  <th className="th">Online/Offline</th>
                  <th className="th">Transaction ID</th>
                  <th className="th">Payment Date</th>
                  <th className="th">Fee Type</th>
                  <th className="th">Amount Paid</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.length ? (
                  paymentHistory.map((payment, index) => (
                    <tr key={index} className="tr">
                      <td className="td">{payment.receipt_no}</td>
                      <td className="td">{payment.admission_number}</td>
                      <td className="td">{payment.regno}</td>
                      <td className="td">{payment.name}</td>
                      <td className="td">{payment.email}</td>
                      <td className="td">{payment.phone_no}</td>
                      <td className="td">{payment.payment_mode}</td>
                      <td className="td">{payment.transaction_id}</td>
                      <td className="td">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </td>
                      <td className="td">{payment.fee_type}</td>
                      <td className="td">₹{payment.amount_paid}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="no-data">
                      No payment history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
