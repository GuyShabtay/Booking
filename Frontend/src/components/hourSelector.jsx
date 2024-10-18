import React, { useState, useEffect } from 'react';

import Summary from './summary';
import './style.css';
import axios from 'axios';
import Button from '@mui/material/Button';
import Loader from './Loader'; // Ensure you have the Loader component available
import { Link, useNavigate,useLocation } from "react-router-dom";


const HourSelector = () => {
  const [showSummary, setShowSummary] = useState(false);
  const [day, setDay] = useState({ availableHours: [] });
  const [loading, setLoading] = useState(true); // Loading state
  

  
  const formattedDate = sessionStorage.getItem('formatted-date');
  const dayName = sessionStorage.getItem('day-name');  
  const navigate = useNavigate();


  useEffect(() => {
    const fetchDay = async () => {
      setLoading(true); // Start loading
      try {
        const { data } = await axios.get(`http://localhost:5000/api/days/findDay`, {
          params: { date: formattedDate }
        });

        if (data) {
          setDay(data); // Set the day if data is returned
        } else {
          setDay({ availableHours: [] }); // Set to empty if no data found
        }
      } catch (error) {
        console.error('Error fetching day:', error);
        setDay({ availableHours: [] }); // Handle fetch error by resetting to empty
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchDay();
  }, [formattedDate]); // Add formattedDate as a dependency to fetch new data if it changes

  const handleTimeButtonClick = (hour) => {
    setShowSummary(true);
    sessionStorage.setItem('progress', 3);
    sessionStorage.setItem('hour', hour);
    navigate('/summary');
  };

  const handleBack = () => {
    sessionStorage.setItem('progress', 1);
    navigate(-1);
  };

  return (
    <section id='hour-selector'>
      {loading ? (
        <Loader /> // Show loader while fetching data
      ) : (
        <>
          <button className='back' onClick={handleBack} ><i className="fa-solid fa-angle-left"></i>חזרה</button>
          <div className='shadow-box'>
          <h1 className='dark-color'>בחירת שעה</h1>
          <p>({dayName}) {formattedDate}</p>
          <div className='hours-container'>
            {day.availableHours.length > 0 ? (
              day.availableHours.map((hour) => (
                <div key={hour}>
                  <Button className='default-bg' variant="contained" onClick={() => handleTimeButtonClick(hour)}>
                    {hour}
                  </Button>
                </div>
              ))
            ) : (
              <h3 className='black-color'>אין שיעורים פנויים ביום זה</h3>
            )}
          </div>
          </div>
        </>
      )}
    </section>
  );
};

export default HourSelector;
