import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";
import clglogo from "../../Assets/pictures/logo.png";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [showPassword,setShowPassword]=useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const studentNameRef = useRef(null);
  const regnoRef = useRef(null);
  const genderRef = useRef(null);
  const dateOfBirthRef = useRef(null);
  const emailRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const aadharNoRef = useRef(null);
  const govtSchoolRef = useRef(null);
  const courseNameRef = useRef(null);
  const batchYearRef = useRef(null);
  const quotaRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const hostellerRef = useRef(null);

  const togglePasswordVisibility=()=>{
    setShowPassword(!showPassword);
  }

  const validateForm = () => {
    let validationErrors = {};

    const studentName = studentNameRef.current.value;
    const regno = regnoRef.current.value;
    const gender = genderRef.current.value;
    const dateOfBirth = dateOfBirthRef.current.value;
    const email = emailRef.current.value;
    const phoneNumber = phoneNumberRef.current.value;
    const aadharNo = aadharNoRef.current.value;
    const govtSchool = govtSchoolRef.current.value;
    const hosteller = hostellerRef.current.value;
    const courseName = courseNameRef.current.value;
    const batchYear = batchYearRef.current.value;
    const quota = quotaRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    // Validate required fields
    if (!studentName) validationErrors.studentName = "Student name is required";
    if (!gender) validationErrors.gender = "Gender is required";
    if (!dateOfBirth)
      validationErrors.dateOfBirth = "Date of birth is required";
    if (!email) validationErrors.email = "Email is required";
    if (!phoneNumber) validationErrors.phoneNumber = "Phone number is required";
    if (!aadharNo) validationErrors.aadharNo = "Aadhar number is required";
    if (!courseName) validationErrors.courseName = "Course name is required";
    if (!batchYear) validationErrors.batchYear = "Batch year is required";
    if (!quota) validationErrors.quota = "Quota is required";
    if (!password) validationErrors.password = "Password is required";
    if (!confirmPassword)
      validationErrors.confirmPassword = "Confirm your password";

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email)) {
      validationErrors.email = "Invalid email format";
    }

    // Validate password strength
    const passwordPattern =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/;
    if (password && !passwordPattern.test(password)) {
      validationErrors.password =
        "Password must be at least 8 characters long and contain letters, numbers, and special characters";
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Clear errors
      setErrors({});

      const registrationData = {
        regno: regnoRef.current.value,
        student_name: studentNameRef.current.value,
        gender: genderRef.current.value,
        dob: dateOfBirthRef.current.value,
        email_id: emailRef.current.value,
        phone_number: phoneNumberRef.current.value,
        aadhar_no: aadharNoRef.current.value,
        govt_school: govtSchoolRef.current.value,
        hosteller: hostellerRef.current.value,
        course_name: courseNameRef.current.value,
        batch_year: batchYearRef.current.value,
        quota: quotaRef.current.value,
        password: passwordRef.current.value,
      };

      try {
        const response = await axios.post(
          "http://localhost:5003/api/register",
          registrationData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          alert(response.data.message || "Registration successful!");
          navigate("/", { replace: true });
          window.history.pushState(null, null, window.location.href);
          window.addEventListener("popstate", function (event) {
            window.history.pushState(null, null, window.location.href);
          });
        } else {
          alert(response.data.error || "Registration failed!");
        }
      } catch (error) {
        alert("Error submitting form");
        console.error("Error submitting form:", error);
      }
    }
  };

  return (
    <div className="form-container">
      <div className="logo text-center">
        <img className="clg-logo" src={clglogo} alt="clg-logo" />
        <h2>SUDHA SASEENDRAN SIDDHA MEDICAL COLLEGE AND HOSPITAL</h2>
        <p>Meecode, Kaliyakkavilai Post, Kanyakumari District - 629153</p>
      </div>
      <form onSubmit={handleSubmit} className="register-form">
        <h1 className="h1">REGISTER HERE</h1>

        <div className="input-group-div">
          <input
            className="register-input"
            type="text"
            ref={regnoRef}
            placeholder="Enter registration number"
          />
        </div>

        <div className="input-group-div">
          <input
            className="register-input"
            type="text"
            ref={studentNameRef}
            placeholder="Enter your full name"
          />
          {errors.studentName && <p className="error">{errors.studentName}</p>}
        </div>

        <div className="input-group-div">
          <select className="register-select" ref={genderRef}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="error">{errors.gender}</p>}
        </div>

        <div className="input-group-div">
          <input className="register-input" type="date" ref={dateOfBirthRef} />
          {errors.dateOfBirth && <p className="error">{errors.dateOfBirth}</p>}
        </div>

        <div className="input-group-div">
          <input
            className="register-input"
            type="email"
            ref={emailRef}
            placeholder="Enter your email"
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="input-group-div">
          <input
            className="register-input"
            type="text"
            ref={phoneNumberRef}
            placeholder="Enter your phone number"
          />
          {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
        </div>

        <div className="input-group-div">
          <input
            className="register-input"
            type="text"
            ref={aadharNoRef}
            placeholder="Enter Aadhar number"
          />
          {errors.aadharNo && <p className="error">{errors.aadharNo}</p>}
        </div>

        <div className="input-group-div">
          <select className="register-select" ref={govtSchoolRef}>
            <option value="">Attended Government School?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="input-group-div">
          <select className="register-select" ref={hostellerRef}>
            <option value="">Hosteller?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="input-group-div">
          <select className="register-select" ref={courseNameRef}>
            <option value="">Select Course</option>
            <option value="B.S.M.S">B.S.M.S</option>
          </select>
        </div>

        <div className="input-group-div">
          <input
            className="register-input"
            type="text"
            ref={batchYearRef}
            placeholder="Enter batch year"
          />
        </div>

        <div className="input-group-div">
          <select className="register-select" ref={quotaRef}>
            <option value="">Select Quota</option>
            <option value="Govt">Govt</option>
            <option value="Management">Management</option>
          </select>
        </div>

        <div className="input-group-div">
          <input
            className="register-input"
            type={showPassword?'text':'password'}
            ref={passwordRef}
            placeholder="Enter your password"
          />
          <span
                onClick={togglePasswordVisibility}
                className="eye-icon"
              >
                {showPassword?<FaEyeSlash/>:<FaEye/>}
              </span>
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="input-group-div">
          <input
            className="register-input"
            type={showPassword?'text':'password'}
            ref={confirmPasswordRef}
            placeholder="Confirm your password"
          />
          <span
                onClick={togglePasswordVisibility}
                className="eye-icon"
              >
                {showPassword?<FaEyeSlash/>:<FaEye/>}
              </span>
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
        </div>

        <button className="button-login register" type="submit">
          Register
        </button>
      </form>
      <div>
        <p className="login-p">
          Already registered?{" "}
          <a className="login-a" href="/">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
