import React, { useState,useEffect } from 'react';
import DateSelector from './DateSelector';
import ProgressBar from './ProgressBar';
import './Style.css';
import profileImg from '../images/profile image.jpg' 
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

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   const removeExpiredHours = async () => {
  //     try {
  //       await axios.put('https://math-lessons-backend.onrender.com/api/days/remove-expired-hours');
  //     } catch (error) {
  //       console.error('Error removing expired hours:', error);
  //     }
  //   };
  //   removeExpiredHours();
  // }, []);

  

  return (
    <section id='front-page'>
        <img id='profile-img' src={profileImg} alt="img" />
        <h1 className='large-header'>יובל שבתאי - מורה פרטית למתמטיקה</h1>
        <Button id='schedule' className='default-bg' variant="contained" onClick={handleSetLesson}>קביעת שיעור</Button>
        <img id='front-page-bg' src={frontPageBg} alt="img" />
        <div id='linear-gradient-bg'></div>
        </section>
  );
};

export default FrontPage;

