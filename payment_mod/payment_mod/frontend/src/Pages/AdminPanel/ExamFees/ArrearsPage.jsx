import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './ArrearsPage.css';

function ArrearsPage() {
    const location = useLocation();
    const students = location.state?.students || {};
    const [allSubjects, setAllSubjects] = useState([]);
    const [arrearSubjects, setArrearSubjects] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [paymentMode, setPaymentMode] = useState('offline');
    const [transactionId, setTransactionId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllSubjects = async () => {
            try {
                const response = await axios.get('http://localhost:5003/api/subjects');
                const fetchedAllSubjects = response.data.map(subject => ({
                    ...subject,
                    fee_amount: parseFloat(subject.fee_amount) || 0
                }));
                setAllSubjects(fetchedAllSubjects);
            } catch (error) {
                console.error('Error fetching all subjects', error.response?.data || error.message);
            }
        };

        fetchAllSubjects();
    }, []);

    useEffect(() => {
        const calculateTotalAmount = () => {
            const arrearFees = arrearSubjects.reduce((sum, sub) => sum + (sub.fee_amount || 0), 0);
            setTotalAmount(arrearFees);
        };

        calculateTotalAmount();
    }, [arrearSubjects]);

    const handleChange = (selectedOptions) => {
        const selectedSubjects = selectedOptions.map(option => {
            const subject = allSubjects.find(sub => sub.subject_code === option.value);
            return {
                ...option,
                fee_amount: subject?.fee_amount || 0
            };
        });
        setArrearSubjects(selectedSubjects);
    };

    const handleRemoveArrear = (subjectCode) => {
        setArrearSubjects(prev => prev.filter(sub => sub.value !== subjectCode));
    };

    const handlePaymentModeChange = (event) => {
        setPaymentMode(event.target.value);
    };

    const handleTransactionIdChange = (event) => {
        setTransactionId(event.target.value);
    };

    // const handleProceedToPayment = () => {
    //     console.log('Proceeding to payment with total amount:', totalAmount);
    //     console.log('Payment Mode:', paymentMode);
    //     console.log('Transaction ID:', transactionId);
    //     navigate('/transactions');
    // };

    const subjectOptions = allSubjects.map(subject => ({
        value: subject.subject_code,
        label: `${subject.subject_code} - ₹${subject.fee_amount.toFixed(2)}`
    }));

    const storeExamFeeTransactions = async () => {
        const paymentDate = new Date().toISOString().slice(0, 10); 
        try {
            console.log(students.name);
            await axios.post(`http://localhost:5003/api/examfee/record`, {
                name: students.name,
                regno: students.regno,
                email: students.email,
                type: 'arrear',
                mode: paymentMode,
                amount: totalAmount,
                no_of_subjects: arrearSubjects.length,
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
            navigate('/exam-fee-transactions');
        } catch (error) {
            console.error('Error processing payment:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
            }
        }
    };


    return (
        <div className="arrears-container">
            <div className="arrears-header">
                <h1>Select Arrears Subjects</h1>
            </div>
            <form>
                <div className="arrear-subject-select-container">
                    <label htmlFor="arrear-subject" className="arrear-subject-select-label">
                        Select subjects to add as arrears:
                    </label>
                    <Select
                        id="arrear-subject"
                        isMulti
                        options={subjectOptions}
                        onChange={handleChange}
                        value={arrearSubjects}
                        className="arrears-select"
                        classNamePrefix="select"
                    />
                </div>
                <div className="arrears-list-container">
                    <h3>Selected Subjects</h3>
                    <ul className="arrears-list">
                        {arrearSubjects.map(subject => (
                            <li key={subject.value} className="arrears-list-item">
                                {subject.label}
                                <button
                                    type="button"
                                    className="remove-button"
                                    onClick={() => handleRemoveArrear(subject.value)}
                                >
                                    &times;
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <h2 className="arrears-total">Total Amount: ₹{totalAmount.toFixed(2)}</h2>
                <div className="payment-mode-container">
                    <label htmlFor="payment-mode" className="payment-mode-label">Payment Mode:</label>
                    <select
                        id="payment-mode"
                        value={paymentMode}
                        onChange={handlePaymentModeChange}
                        className="payment-mode-select"
                    >
                        <option value="offline">Offline</option>
                        <option value="online">Online</option>
                    </select>
                </div>
                {paymentMode === 'online' && (
                    <div className="transaction-id-container">
                        <label htmlFor="transaction-id" className="transaction-id-label">Enter Transaction ID:</label>
                        <input
                            type="text"
                            id="transaction-id"
                            value={transactionId}
                            onChange={handleTransactionIdChange}
                            className="transaction-id-input"
                        />
                    </div>
                )}
                <button type="button" className="arrears-button" onClick={handlePaymentSubmit}>
                    Proceed to Payment
                </button>
            </form>
        </div>
    );
}

export default ArrearsPage;
