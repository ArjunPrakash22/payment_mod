import React, { useState, useEffect } from 'react';
import axios from 'axios';
import $ from 'jquery';
import 'jquery-validation';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Login.css';
import clglogo from '../../Assets/pictures/logo.png'


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // jQuery script to handle form interaction and validation
    $('.placeholder').click(function() {
      $(this).siblings('input').focus();
    });

    $('.form-control').focus(function() {
      $(this).parent().addClass('focused');
    });

    $('.form-control').blur(function() {
      const $this = $(this);
      if ($this.val().length === 0) $(this).parent().removeClass('focused');
    });
    $('.form-control').blur();

    $.validator.setDefaults({
      errorElement: 'span',
      errorClass: 'validate-tooltip',
    });

    $('#formvalidate').validate({
      rules: {
        userName: {
          required: true,
          minlength: 6,
        },
        userPassword: {
          required: true,
          minlength: 6,
        },
      },
      messages: {
        userName: {
          required: 'Please enter your username.',
          minlength: 'Please provide a valid username.',
        },
        userPassword: {
          required: 'Enter your password to Login.',
          minlength: 'Incorrect login or password.',
        },
      },
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5003/api/login', {
        username,
        password,
      });

      if (response.data.success) {
        // Redirect to the dashboard on successful login
        navigate('/dashboard',{state:{key:username

        }});
      } else {
        setErrorMessage('Invalid username or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-div">
      <div className="logo text-center">
        <img className='clg-logo' src={clglogo} alt='clg-logo'/>
      </div>
      <div className="wrapper">
        <div className="inner-wrapper text-center">
          <h2 className="title  h1">WELCOME</h2>
          <form id="formvalidate" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="placeholder" htmlFor="userName">User Name</label>
              <input
                className="form-control"
                name="userName"
                id="userName"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <span className="lighting"></span>
            </div>
            <div className="input-group">
              <label className="placeholder" htmlFor="userPassword">Password</label>
              <input
                className="form-control"
                name="userPassword"
                id="userPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="lighting"></span>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <button className='button-login' type="submit" id="login">Login</button>
            <div className="clearfix supporter">
              <div className="pull-left remember-me">
                <input id="rememberMe" type="checkbox" />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>
              {<a className="forgot pull-right" href="#">Forgot Password?</a> }
            </div>
          </form>
        </div>
        <div className="signup-wrapper text-center">
          { <a href="/register">Don't have an account? <span className="text-primary">Create One</span></a> }
        </div>
      </div>
    </div>
  );
};

export default Login;
