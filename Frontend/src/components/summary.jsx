import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import axios from 'axios';
import './Style.css';

const Summary = () => {
  const [showApproveMessage, setShowApproveMessage] = useState(false);

  const formattedDate = sessionStorage.getItem('formatted-date');
  const dayName = sessionStorage.getItem('day-name');
  const hour = sessionStorage.getItem('hour');
  const name = localStorage.getItem('name'); // Assuming you have these in sessionStorage
  const school = localStorage.getItem('school'); // Assuming you have these in sessionStorage
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
    sessionStorage.setItem('progress', 2);
  };

  // Event handler for form submission
  const handleConfirmSummary = async () => {
    try {
      // Send the required data to the backend
      const response = await axios.put('https://math-lessons-backend.onrender.com/api/days/update', {
        date: formattedDate,
        hour,
        name,
        school
      });

      if (response.status === 200) {
        sessionStorage.setItem('progress', 4);
        navigate('/approve-message');
      } else {
        console.error('Error updating hour:', response.data.message);
      }
    } catch (error) {
      console.error('Failed to update hour:', error);
    }
  };

  return (
    <section id='summary'>
      <button className='back' onClick={handleBack}><i className="fa-solid fa-angle-right"></i>חזרה</button>
      <div className='shadow-box'>
        <h1 className='light-color large-header'>סיכום</h1>
        <div id="summary-details">
          <div className='same-row'>
            <p>({dayName})</p>
            <p>{formattedDate} <strong>:תאריך</strong></p>
          </div>
          <p><strong>שעה:</strong> {hour}</p>
        </div>
        <Button onClick={handleConfirmSummary} id='confirm-summary' className='light-bg' variant="contained">אישור</Button>
      </div>
    </section>
  );
};

export default Summary;
