import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import './Register.css';

const Register = () => {
    const [errors, setErrors] = useState({});
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
    // const photoRef = useRef(null);

    const validateForm = () => {
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

        // Validate required fields
        if (!studentName) validationErrors.studentName = "Student name is required";
        if (!counsellingCode) validationErrors.counsellingCode = "Counselling code is required";
        if (!dateOfBirth) validationErrors.dateOfBirth = "Date of birth is required";
        if (!email) validationErrors.email = "Email is required";
        if (!password) validationErrors.password = "Password is required";
        if (!confirmPassword) validationErrors.confirmPassword = "Confirm your password";

    // Validate phone number length
    if (phoneNumber && phoneNumber.length !== 10) {
      validationErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }

        // Validate names to allow only alphabets and spaces
        const namePattern = /^[A-Za-z\s]+$/;
        if (studentName && !namePattern.test(studentName)) {
            validationErrors.studentName = "Student name must contain only alphabets";
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailPattern.test(email)) {
            validationErrors.email = "Invalid email format";
        }

        // Validate password strength
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/;
        if (password && !passwordPattern.test(password)) {
            validationErrors.password = "Password must be at least 8 characters long and contain both letters and numbers";
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

            const formData = new FormData();
            formData.append('counseling_code', counsellingCodeRef.current.value);
            formData.append('student_name', studentNameRef.current.value);
            formData.append('date_of_birth', dateOfBirthRef.current.value);
            formData.append('community', communityRef.current.value);
            formData.append('course_name', courseNameRef.current.value);
            formData.append('batch_year', batchYearRef.current.value);
            formData.append('phone_number', phoneNumberRef.current.value);
            formData.append('email_id', emailRef.current.value);
            formData.append('password', passwordRef.current.value);
            // Uncomment if photo upload is needed
            // formData.append('photo', photoRef.current.files[0]);
            for (const [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            try {
                const response = await axios.post('http://localhost:5003/api/register', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            
                if (response.status === 200) {
                    alert(response.data.message || "Registration successful!");
                } else {
                    alert(response.data.error || "Registration failed!");
                }
            } catch (error) {
                alert("Error submitting form");
                console.error('Error submitting form:', error);
            }
        }
    };

    return (
        <div className="form-container">
            
            <form onSubmit={handleSubmit} className='register-form'>
            <h1>Registration Form</h1>
                {/* Form fields with validation errors displayed */}
                <div className="input-group-register">
                    <div className="input-group-div">
                        {/* <h4><label className='register-label'>First Name:</label></h4> */}
                        <input
                            className="register-input"
                            type="text"
                            ref={studentNameRef}
                            placeholder="Enter your first name"
                        />
                        {errors.studentName && <p className="error">{errors.studentName}</p>}
                    </div>
                </div>

                <div>
                    {/* <h4><label className='register-label'>Email:</label></h4> */}
                    <input
                        className="register-input"
                        type="email"
                        ref={emailRef}
                        placeholder="Enter your email"
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>

                <div className="input-group-register">
                    <div className="input-group-div">
                        {/* <h4><label className='register-label'>Password:</label></h4> */}
                        <input
                            className="register-input"
                            type="password"
                            ref={passwordRef}
                            placeholder="Enter your password"
                        />
                        {errors.password && <p className="error">{errors.password}</p>}
                    </div>

                    <div>
                        {/* <h4><label className='register-label'>Confirm Password:</label></h4> */}
                        <input
                            className="register-input"
                            type="password"
                            ref={confirmPasswordRef}
                            placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                    </div>
                </div>

                <div className="input-group-register">
                    <div className="input-group-div">
                        {/* <h4><label className='register-label'>Counselling Code:</label></h4> */}
                        <input
                            className="register-input"
                            type="text"
                            ref={counsellingCodeRef}
                            placeholder="Enter counselling code"
                        />
                    </div>
                </div>

                <div>
                    {/* <h4><label className='register-label'>Date of Birth:</label></h4> */}
                    <input
                        className="register-input"
                        type="date"
                        ref={dateOfBirthRef}
                    />
                </div>

                <div className="input-group-register">
                    <div className="input-group-div">
                        {/* <h4><label className='register-label'>Community:</label></h4> */}
                        <input
                            className="register-input"
                            type="text"
                            ref={communityRef}
                            placeholder="Enter community"
                        />
                    </div>
                </div>

                <div className="input-group-register">
                    <div className="input-group-div">
                        {/* <h4><label className='register-label'>Course Name:</label></h4> */}
                        <select
                            className='register-select'
                            ref={courseNameRef}
                        >
                            <option value="">Select Course</option>
                            <option value="B.S.M.S">B.S.M.S</option>
                        </select>
                    </div>
                </div>

                <div className="input-group-register">
                    <div className="input-group-div">
                        {/* <h4><label className='register-label'>Batch Year:</label></h4> */}
                        <input
                            className="register-input"
                            type="text"
                            ref={batchYearRef}
                            placeholder="Enter batch year"
                        />
                    </div>
                </div>

                <div className="input-group-register">
                    <div className="input-group-div">
                        {/* <h4><label className='register-label'>Phone Number:</label></h4> */}
                        <input
                            className="register-input"
                            type="text"
                            ref={phoneNumberRef}
                            placeholder="Enter phone number"
                        />
                        {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
                    </div>
                </div>

                <button className="register-button" type="submit">Register</button>
            </form>
            <div>
                <p className='login-p'>Already registered? <a className='login-a' href='/'>Sign in</a></p>
            </div>
        </div>
    );
};

export default Register;
