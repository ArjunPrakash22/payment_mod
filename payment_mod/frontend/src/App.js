import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import { Login,
  Register,
  Dashboard,
AdminPanel } from "./Pages";
import TuitionFeesPage from "./Pages/AdminPanel/TuitionFeesPage"; 
import HostelFeesPage from "./Pages/AdminPanel/HostelFeesPage"; 
import CollegeFeesPage from "./Pages/AdminPanel/CollegeFeesPage"; 
import OtherFeesPage from "./Pages/AdminPanel/OtherFeesPage"; 


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
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/tuition-fees" element={<TuitionFeesPage />}/>
        <Route path="/hostel-fees" element={<HostelFeesPage />}/>
        <Route path="/college-fees" element={<CollegeFeesPage />}/>
        <Route path="/other-fees" element={<OtherFeesPage />}/>
      </Routes>
    </div>
  );
}

export default App;
