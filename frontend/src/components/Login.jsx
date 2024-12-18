import React, { useState } from 'react';
import axios from 'axios';
import ValidationTextFields from './ValidationTextFields';
import account from '../images/account.png'; 
import loginTopCover from '../images/login top cover.jpg';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState('');  
  const [school, setSchool] = useState('');  
  const navigate = useNavigate();

  // Event handler for form submission
  const updateDetails = async (e) => {
    try {
      // Call the backend API to check login or register user
      const response = await axios.post('https://math-lessons-backend.onrender.com/api/days/login', { name, school });
      
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
    <section id='login'>
      <img id='login-cover-img' src={loginTopCover} alt="cover" />
      <h1 className='dark-color'>התחברות</h1>
      <div id="login-form" className='shadow-box'>
        <img id='login-img' src={account} alt="profile" />
        <ValidationTextFields
          updateDetails={updateDetails}
          name={name}
          setName={setName}
          school={school}
          setSchool={setSchool}
        />
      </div>
    </section>
  );
};

export default Login;
