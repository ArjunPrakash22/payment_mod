import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './ProvisionalPage.css';


function ProvisionalPage() {
    const location = useLocation();
    const students = location.state?.students || {};
    const [provisionalStatus, setProvisionalStatus] = useState('first');
    const [subjects, setSubjects] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [paymentMode, setPaymentMode] = useState('offline');
    const [transactionId, setTransactionId] = useState('');
    
    const [amountToPay, setAmountToPay] = useState(0);
   
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProvisionalSubjects = async () => {
            try {
                const response = await axios.get(`http://localhost:5003/api/subjects?provisional=${provisionalStatus}`);
                const fetchedSubjects = response.data.map(subject => ({
                    ...subject,
                    fee_amount: parseFloat(subject.fee_amount)
                }));
                setSubjects(fetchedSubjects);
                const total = fetchedSubjects.reduce((sum, sub) => sum + sub.fee_amount, 0);
                setTotalAmount(total);
                setAmountToPay(total); // Assuming total amount to pay is the sum of all subject fees
            } catch (error) {
                console.error('Error fetching provisional subjects', error.response?.data || error.message);
            }
        };

        fetchProvisionalSubjects();
    }, [provisionalStatus]);

    const handleProvisionalChange = (event) => {
        setProvisionalStatus(event.target.value);
    };

    const handlePaymentModeChange = (event) => {
        setPaymentMode(event.target.value);
    };

    const handleTransactionIdChange = (event) => {
        setTransactionId(event.target.value);
    };

    // const handleGenerateReceipt = () => {
    //     // Handle receipt generation, maybe include transactionId and paymentMode in request
    //     navigate('/transactions');
    // };

    const storeExamFeeTransactions = async () => {
        const paymentDate = new Date().toISOString().slice(0, 10); 
        try {
            console.log(students.name);
            await axios.post(`http://localhost:5003/api/examfee/record`, {
                name: students.name,
                regno: students.regno,
                email: students.email,
                type: 'regular',
                mode: paymentMode,
                amount: amountToPay,
                no_of_subjects: subjects.length,
                transaction_id: paymentMode === 'online' ? transactionId : 'cash',
                transaction_time: paymentDate
            });
            console.log('Payment details stored successfully');
        } catch (error) {
            console.error('Error storing payment details:', error);
        }
    };

    

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        try {
            await storeExamFeeTransactions();
            await axios.post(`http://localhost:5003/api/studentfee`, {
                email: students.email,
                ...students,
                exam_fees: 0,
            });
            console.log(`Payment processed for ${students.name}: ₹${amountToPay} (${paymentMode} payment)`);
            
            navigate('/exam-fee-transactions');
        } catch (error) {
            console.error('Error processing payment:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            }
        }
    };

    return (
        <div className="provisional-container">
            <div className="provisional-header">
                <h1>Provisional Exam Fees</h1>
            </div>
            <form className="provisional-form" onSubmit={handlePaymentSubmit}>
                <div>
                    <label htmlFor="provisional">Select Provisional:</label>
                    <select id="provisional" value={provisionalStatus} onChange={handleProvisionalChange} className="provisional-select">
                        <option value="first">First Provisional</option>
                        <option value="second">Second Provisional</option>
                        <option value="third">Third Provisional</option>
                    </select>
                </div>
                <div>
                    <h2>Subjects for {provisionalStatus} Provisional</h2>
                    <ul className="provisional-list">
                        {subjects.map(subject => (
                            <li key={subject.subject_code} className="provisional-list-item">
                                {subject.subject_code} - ₹{subject.fee_amount.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>
                <h2 className="provisional-total">Total Amount: ₹{totalAmount.toFixed(2)}</h2>
                <div className="payment-mode-container">
                    <label htmlFor="payment-mode">Payment Mode:</label>
                    <select id="payment-mode" value={paymentMode} onChange={handlePaymentModeChange} className="payment-mode-select">
                        <option value="offline">Offline</option>
                        <option value="online">Online</option>
                    </select>
                </div>
                {paymentMode === 'online' && (
                    <div className="transaction-id-container">
                        <label htmlFor="transaction-id">Enter Transaction ID:</label>
                        <input
                            type="text"
                            id="transaction-id"
                            value={transactionId}
                            onChange={handleTransactionIdChange}
                            className="transaction-id-input"
                        />
                    </div>
                )}
                <button type="submit" className="provisional-button">
                    Generate Payment Receipt
                </button>
            </form>
        </div>
    );
}

export default ProvisionalPage;
