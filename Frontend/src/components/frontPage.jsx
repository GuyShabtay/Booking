import React, { useState,useEffect } from 'react';
import DateSelector from './dateSelector';
import ProgressBar from './progressBar';
import './style.css';
import profile from '../images/profile.png'; 
import frontPageBg from '../images/front page bg.jpg'
import Button from '@mui/material/Button';
import Login from './Login';
import { useNavigate } from "react-router-dom";
import axios from 'axios';





const FrontPage = () => {
  // const [showDateSelector, setShowDateSelector] = useState(false);
  const navigate = useNavigate();


  const handleSetLesson = () => {
    const storedName = localStorage.getItem('name'); // Or use localStorage if you prefer persistence across sessions
    const storedSchool = localStorage.getItem('school'); // Or use localStorage if you prefer persistence across sessions
    if (storedName && storedSchool) {
      // Automatically navigate to the next page if the user is already logged in
      if(storedName===import.meta.env.VITE_ADMIN_NAME)
      navigate('/admin-date-selector');
      else
      navigate('/date-selector');
    }
    else
      navigate('/login');
  };

  useEffect(() => {
    const removeExpiredHours = async () => {
      try {
        await axios.put('/api/days/remove-expired-hours');
      } catch (error) {
        console.error('Error removing expired hours:', error);
      }
    };
    removeExpiredHours()
  }, []);

  

  return (
    <div id='main-container'>
    
        <section id='front-page'>
        <div id='img-bg'>
        <img id='personal-img' src={profile} alt="img" />

        <h1>יובל שבתאי - מורה פרטית למתמטיקה</h1>
        </div>
        <div id='background'>
        <img id='bg' src={frontPageBg} alt="img" />
          <Button id='schedule' className='default-bg' variant="contained" onClick={handleSetLesson}>קביעת שיעור</Button>
          </div>
        </section>
    </div>
  );
};

export default FrontPage;

