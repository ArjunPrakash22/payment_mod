import React, { useRef } from "react";
import "./Register.css";

const Register = () => {
  const studentNameRef = useRef(null);
  const counsellingCodeRef = useRef(null);
  const dateOfBirthRef = useRef(null);
  const communityRef = useRef(null);
  const courseNameRef = useRef(null);
  const batchYearRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const photoRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    const studentName = studentNameRef.current.value;
    const counsellingCode = counsellingCodeRef.current.value;
    const dateOfBirth = dateOfBirthRef.current.value;
    const community = communityRef.current.value;
    const courseName = courseNameRef.current.value;
    const batchYear = batchYearRef.current.value;
    const phoneNumber = phoneNumberRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    const photo = photoRef.current.files[0];

    // Validate phone number length
    if (phoneNumber && phoneNumber.length !== 10) {
      validationErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }

    // Validate names to allow only alphabets and spaces
    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(studentName)) {
      validationErrors.studentName = "Student name must contain only alphabets";
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      validationErrors.email = "Invalid email format";
    }

    // Validate password strength
    const passwordPattern =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/;
    if (!passwordPattern.test(password)) {
      validationErrors.password =
        "Password must be at least 8 characters long and contain both letters and numbers";
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      // Display errors (implement this as needed)
      alert(JSON.stringify(validationErrors, null, 2));
    } else {
      // Submit form data
      const formData = new FormData();
      formData.append("studentName", studentName);
      formData.append("counsellingCode", counsellingCode);
      formData.append("dateOfBirth", dateOfBirth);
      formData.append("community", community);
      formData.append("courseName", courseName);
      formData.append("batchYear", batchYear);
      formData.append("phoneNumber", phoneNumber);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("photo", photo);

      try {
        const response = await fetch("/register", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.message || "Registration successful!");
        } else {
          alert(result.error || "Registration failed!");
        }
      } catch (error) {
        alert("Error submitting form");
      }
    }
  };

  return (
    <div className="form-container">
      <h1>Registration Form</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="input-group">
          <div className="input-group-div">
            <input
              className="register-input"
              type="text"
              ref={studentNameRef}
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div>
          <input
            className="register-input"
            type="email"
            ref={emailRef}
            placeholder="Enter your emailid"
          />
        </div>

        <div className="input-group">
          <div className="input-group-div">
            <input
              className="register-input"
              type="password"
              ref={passwordRef}
              placeholder="Enter your password"
            />
          </div>

          <div>
            <input
              className="register-input"
              type="password"
              ref={confirmPasswordRef}
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <div className="input-group">
          <div className="input-group-div">
            <input
              className="register-input"
              type="text"
              ref={counsellingCodeRef}
              placeholder="Enter counselling code"
            />

            <div>
              <input
                className="register-input"
                type="date"
                ref={dateOfBirthRef}
              />
            </div>
          </div>
        </div>

        <div className="input-group">
          <div className="input-group-div">
            <input
              className="register-input"
              type="text"
              ref={communityRef}
              placeholder="Enter community"
            />
          </div>
        </div>

        <div className="input-group">
          <div className="input-group-div">
            <select className="register-select" ref={courseNameRef}>
              <option value="">Select Course</option>
              <option value="B.S.M.S">B.S.M.S</option>
            </select>

            <div>
              <input
                className="register-input"
                type="text"
                ref={batchYearRef}
                placeholder="Enter batch (eg:2024-2026)"
              />
            </div>
          </div>
        </div>

        <div className="input-group">
          <div className="input-group-div">
            <input
              className="register-input"
              type="text"
              ref={phoneNumberRef}
              placeholder="Enter phone number"
            />
          </div>
        </div>

        <div>
          <input className="register-input" type="file" ref={photoRef} />
        </div>

        <button className="register-btn" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
