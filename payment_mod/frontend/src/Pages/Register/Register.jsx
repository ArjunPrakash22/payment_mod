import React, { useRef, useState } from "react";
import axios from "axios";
import "./Register.css";
import clglogo from "../../Assets/pictures/logo.png";

const Register = () => {
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isEmailChecking, setIsEmailChecking] = useState(false);
  const [isEmailUnique, setIsEmailUnique] = useState(true);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [error, setError] = useState("");

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

    //valid Registration Number
    const Reg = /^[a-zA-Z0-9]$/;

    if (Reg.test(regno)) {
      console.log("Valid registration number.");
    } else {
      console.log("Invalid registration number. Only letters and numbers are allowed.");
    }
    //
    // Validate phone number
    const phonePattern = /^[6-9]\d{9}$/;
    if (phoneNumber && !phonePattern.test(phoneNumber)) {
      validationErrors.phoneNumber = "Invalid phone number";
    }
    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email)) {
      validationErrors.email = "Invalid email format";
    }
    // Validate Aadhar number
    const aadharPattern = /^\d{12}$/;
    if (aadharNo && !aadharPattern.test(aadharNo)) {
      validationErrors.aadharNo = "Invalid Aadhar number";
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

  const checkEmailUnique = async () => {
    const email = emailRef.current.value;
    console.log(email);

    if (!email) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
      return;
    }

    setIsEmailChecking(true);

    try {
      const response = await axios.post(
        "http://localhost:5003/api/check-email/",
        { mailid: email }
      );

      if (response.data.message) {
        setIsEmailChecking(true);
        setEmailStatus(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.data.error) {
        setIsEmailChecking(false);
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Email already exists",
        }));
      } else {
        setIsEmailChecking(false);
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Error in Validation",
        }));
      }
    } finally {
      setIsEmailChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      if (!isEmailUnique) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Email already exists",
        }));
        return;
      }

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

          // Clear the form fields after successful registration
          regnoRef.current.value = "";
          studentNameRef.current.value = "";
          genderRef.current.value = "";
          dateOfBirthRef.current.value = "";
          emailRef.current.value = "";
          phoneNumberRef.current.value = "";
          aadharNoRef.current.value = "";
          govtSchoolRef.current.value = "";
          hostellerRef.current.value = "";
          courseNameRef.current.value = "";
          batchYearRef.current.value = "";
          quotaRef.current.value = "";
          passwordRef.current.value = "";
          confirmPasswordRef.current.value = "";

          // Reset errors and states
          setErrors({});
          setIsEmailUnique(true);
        } else {
          alert(response.data.error || "Registration failed!");
        }
      } catch (error) {
        alert("Error submitting form");
      }
    }
  };

  const handleFocus = (field) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: null,
    }));
  };

  return (
    <div className="form-container">
      <div className="logo text-center">
        <img className="clg-logo" src={clglogo} alt="clg-logo" />
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
          <span className="lighting"></span>

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
  <input
    className="register-input"
    id="Date"
    placeholder="Date of Birth"
    type="text"
    onFocus={(e) => e.target.type = 'date'}
    onBlur={(e) => !e.target.value && (e.target.type = 'text')}
    ref={dateOfBirthRef}
  />
  
  {errors.dateOfBirth && <p className="error">{errors.dateOfBirth}</p>}
</div>

        <div className="input-group-div">
          <input
            className="register-input"
            type="email"
            ref={emailRef}
            placeholder="Enter your email"
            onBlur={checkEmailUnique}
            onFocus={() => handleFocus("email")}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="input-group-div">
          <input
            className="register-input"
            type="text"
            ref={phoneNumberRef}
            placeholder="Enter phone number"
            onFocus={() => handleFocus("phoneNumber")}
          />
          {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
        </div>

        <div className="input-group-div">
          <input
            className="register-input"
            type="text"
            ref={aadharNoRef}
            placeholder="Enter Aadhar number"
            onFocus={() => handleFocus("aadharNo")}
          />
          {errors.aadharNo && <p className="error">{errors.aadharNo}</p>}
        </div>

        <div className="input-group-div">
          <select className="register-select" ref={govtSchoolRef}>
            <option value="">Attended Government School?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {errors.batchYear && <p className="error">{errors.govtSchool}</p>}

        </div>

        <div className="input-group-div">
          <select className="register-select" ref={hostellerRef}>
            <option value="">Hosteller</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {errors.hosteller && <p className="error">{errors.hosteller}</p>}
          
        </div>

        <div className="input-group-div">
          <select className="register-select" ref={courseNameRef}>
            <option value="">Select Course</option>
            <option value="B.S.M.S">B.S.M.S</option>
          </select>
          {errors.courseName && <p className="error">{errors.courseName}</p>}
        </div>

        <div className="input-group-div">
          <input
            className="register-input"
            type="text"
            ref={batchYearRef}
            placeholder="Enter batch year"
            onFocus={() => handleFocus("batchYear")}
          />
          {errors.batchYear && <p className="error">{errors.batchYear}</p>}
        </div>

        <div className="input-group-div">
          <select className="register-select" ref={quotaRef}>
            <option value="">Select Quota</option>
            <option value="Govt">Govt</option>
            <option value="Management">Management</option>
          </select>
          {errors.quota && <p className="error">{errors.quota}</p>}


        </div>

        <div className="input-group-div">
          <input
            className="register-input"
            type={passwordVisible ? "text" : "password"}
            ref={passwordRef}
            placeholder="Enter your password"
            onFocus={() => handleFocus("password")}
          />
          <i
            className={`fas ${
              passwordVisible ? "fa-eye-slash" : "fa-eye"
            } password-toggle-icon`}
            onClick={() => setPasswordVisible(!passwordVisible)}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="input-group-div">
          <input
            className="register-input"
            type={confirmPasswordVisible ? "text" : "password"}
            ref={confirmPasswordRef}
            placeholder="Confirm your password"
            onFocus={() => handleFocus("confirmPassword")}
          />
          <i
            className={`fas ${
              confirmPasswordVisible ? "fa-eye-slash" : "fa-eye"
            } password-toggle-icon`}
            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
        </div>

        <button className="button-login register" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
