import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ValidationTextFields from './ValidationTextFields';
import account from '../images/account.png'; 
import loginTopCover from '../images/login top cover.jpg';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState('');  // Store user name input
  const [school, setSchool] = useState('');  // Store user school input
  const navigate = useNavigate();

  // Event handler for form submission
  const updateDetails = async (e) => {
    // e.preventDefault();
    try {
      // Call the backend API to check login or register user
      const response = await axios.post('http://localhost:5000/api/days/login', { name, school });
      console.log(response);
      
      if (response.data.message === 'login') {
        console.log('Login successful');
      } else if (response.data.message === 'register') {
        console.log('User registered');
      }
      
      // Store user details in sessionStorage for future auto-login
      localStorage.setItem('name', name);
      localStorage.setItem('school', school); 

      if(name===import.meta.env.VITE_ADMIN_NAME)
        navigate('/admin-date-selector');
      else
      navigate('/date-selector');
      
    } catch (error) {
      console.error('Error processing login:', error);
    }
  };

  return (
    <div id='login'>
      <img id='login-cover-img' src={loginTopCover} alt="cover" />
      <h1 className='dark-color'>התחברות</h1>
      <div id="login-form">
        <img id='login-img' src={account} alt="profile" />
        <ValidationTextFields
          updateDetails={updateDetails}
          name={name}
          setName={setName}
          school={school}
          setSchool={setSchool}
        />
      </div>
    </div>
  );
};

export default Login;
