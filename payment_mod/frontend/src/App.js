import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import { 
  Login,  Register,  Dashboard,    AdminPanel,
  TuitionFeesPage, 
  HostelFeesPage,
  CollegeFeesPage,
  OtherFeesPage,
  TransportFeesPage,
  ForgotPassword
} from "./Pages";
import {Footer} from './Components';

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
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Forgot Password route */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tuition-fees" element={<TuitionFeesPage />} />
        <Route path="/hostel-fees" element={<HostelFeesPage />} />
        <Route path="/college-fees" element={<CollegeFeesPage />} />
        <Route path="/other-fees" element={<OtherFeesPage />} />
        <Route path="/transport-fees" element={<TransportFeesPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
