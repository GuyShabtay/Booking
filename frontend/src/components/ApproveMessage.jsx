import React, { useState,useEffect } from 'react';
import './Style.css';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti'; // Import the confetti library
import Button from '@mui/material/Button';


const ApproveMessage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const formattedDate = sessionStorage.getItem('formatted-date');
  const dayName = sessionStorage.getItem('day-name');
    const hour = sessionStorage.getItem('hour');

  useEffect(() => {
    window.scrollTo(0, 0);
    // Trigger confetti when the button is clicked
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });


    // Navigate to home after a delay
    setTimeout(() => {
      handleBackToHome()
    }, 6000); 
  }, []);

  const handleBackToHome = () => {
    sessionStorage.setItem('progress', 1);
    navigate('/date-selector');     
    
  };


  

  return (
    <section id='approve-message'>
      <i className="fa-solid fa-circle-check fa-5x secondary-color"></i>
      <p>קבעת שיעור במתמטיקה</p>
      <div className='same-row'>
        <p> ({dayName}) </p>
        <p>{formattedDate} בתאריך </p>
      </div>
      <p> {hour} בשעה</p>
      <h1 className='big-header'>!! בהצלחה</h1>
      <div className='back-to-home-container secondary-bg'>
        <div className='back-to-home'>
        <Button className='back-to-home-btn' color='white' onClick={handleBackToHome}>חזרה לדף הבית</Button>
        </div>
      </div>
    </section>
  );
};

export default ApproveMessage;