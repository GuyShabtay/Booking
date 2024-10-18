import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import axios from 'axios';
import '../Style.css';
import topCover from '../../images/top cover.jpg';
import ValidationTextFields from '../ValidationTextFields';


const AdminAddLesson = () => {
  const [showApproveMessage, setShowApproveMessage] = useState(false);

  const formattedDate = sessionStorage.getItem('formatted-date');
  const dayName = sessionStorage.getItem('day-name');
    const hour = sessionStorage.getItem('hour');
  const [name, setName] = useState('');  // Store user name input
  const [school, setSchool] = useState('');  // Store user school input
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
    sessionStorage.setItem('progress', 2);
  };

  // Event handler for form submission
  const handleConfirmSummary = async () => {
    try {
      // Send the required data to the backend
      const response = await axios.put('http://localhost:5000/api/days/update', {
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

  // Event handler for form submission
  const updateDetails = async (e) => {
    // e.preventDefault();
    try {
      // Send the required data to the backend
      const response = await axios.put('http://localhost:5000/api/days/update', {
        date: formattedDate,
        hour,
        name,
        school
      });

      if (response.status === 200) {
        sessionStorage.setItem('progress', 4);
        navigate(-1);
      } else {
        console.error('Error updating hour:', response.data.message);
      }
    } catch (error) {
      console.error('Failed to update hour:', error);
    }
  };

  return (
    <section id='admin-add-lesson'>
    <img id='top-img' src={topCover} alt="img" />

      <button className='back' onClick={handleBack}><i className="fa-solid fa-angle-right"></i>חזרה</button>
      <div className='shadow-box'>
        <h1 className='light-color'>הוספת שיעור לתלמיד</h1>
        <div id="summary-details">
          <div className='same-row'>
            <p>({dayName})</p>
            <p>{formattedDate} <strong>:תאריך</strong></p>
          </div>
          <p><strong>שעה:</strong> {hour}</p>
        </div>
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

export default AdminAddLesson;
