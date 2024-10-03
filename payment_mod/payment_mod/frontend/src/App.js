import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import {
  Login,
  Register,
  Dashboard,
  AdminPanel,
  TuitionFeesPage,
  HostelFeesPage,
  CollegeFeesPage,
  OtherFeesPage,
  TransportFeesPage,
  RegistrationFeesPage,
  CautionDeposit,
  PaymentHistory,
  HomePage,
  ProvisionalPage,
  ArrearsPage,
  ExamFeeTransactions
} from './Pages';
import PaymentRequest from "./Pages/AdminPanel/Request/PaymentRequest"
import Footer from "./Components/Footer/Footer";



function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tuition-fees" element={<TuitionFeesPage />} />
        <Route path="/hostel-fees" element={<HostelFeesPage />} />
        <Route path="/college-fees" element={<CollegeFeesPage />} />
        <Route path="/other-fees" element={<OtherFeesPage />} />
        <Route path="/transport-fees" element={<TransportFeesPage />} />
        <Route path="/reg-fees" element={<RegistrationFeesPage />} />
        <Route path="/caution-deposit" element={<CautionDeposit />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/exam-fees" element={<HomePage />} />
        <Route path="/exam-fees/Provisional" element={<ProvisionalPage />} />
        <Route path="/exam-fees/Arrears" element={<ArrearsPage/>} />
        <Route path="/exam-fee-transactions" element={<ExamFeeTransactions/>} />
        <Route path="/payment-request" element={<PaymentRequest />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
