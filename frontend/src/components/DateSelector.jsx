import React, { useState, useEffect } from 'react';
import './Style.css';
import HourSelector from './HourSelector';
import axios from 'axios';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import NextLessons from './NextLessons';
import Button from '@mui/material/Button';
import { Link, useNavigate } from "react-router-dom";
import Loader from './Loader';



const DateSelector = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  // const [selectedDate, setSelectedDate] = useState(null);
  const [showHourSelector, setShowHourSelector] = useState(false);
  const [availableDays, setAvailableDays] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  
  useEffect(() => {
    sessionStorage.setItem('progress', 1);
    
    const fetchDays = async () => {
      setLoading(true);
      const { data } = await axios.get(`https://math-lessons-backend.onrender.com/api/days`);
      const daysWithAvailableHours = data.filter(day => day.availableHours.length > 0);
      const availableDaysArray = daysWithAvailableHours.map(day => day.date);
      setAvailableDays(availableDaysArray);
      setLoading(false);

    };

    fetchDays();
  }, []);

  const generateDates = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startingDayIndex = firstDay.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const totalDays = daysInMonth(currentDate);
    const dates = [];

    

    // Add empty cells for days before the start of the month
    for (let i = 0; i < startingDayIndex; i++) {
      dates.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= totalDays; i++) {
      dates.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    return dates;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    // setSelectedDate(date);
  
    sessionStorage.setItem('progress', 2);
    sessionStorage.setItem('formatted-date',format(date, 'dd/MM/yy', { locale: he }));
    sessionStorage.setItem('day-name',format(date, 'EEEE', { locale: he }));
    navigate('/hour-selector');


  };

  const dateToString = (date) => {
    return format(date, 'dd/MM/yy', { locale: he }) };

  const handleLogout = () => {
    localStorage.clear();  // Removes all items from localStorage
    sessionStorage.clear();  // Removes all items from sessionStorage
    navigate('/login');
  }

  return (
    <div id='date-selector'>
    {loading ? (
      <Loader /> // Show loader while fetching or adding data
    ) : (
      <>
    <Button id='logout-btn' className='primary-bg' variant="contained" onClick={handleLogout}>התנתקות</Button>
    <NextLessons/>
    <div id='date-selector-container' className='shadow-box primary-color'>

      <h1 className='primary-color large-header'>בחירת תאריך</h1>

      <div className="same-row">
      
      <button onClick={handlePrevMonth} className='months-arrow'><i className="fa-solid fa-chevron-left"></i></button>
      <h1>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h1>
      <button onClick={handleNextMonth} className='months-arrow'><i className="fa-solid fa-chevron-right"></i></button>
      </div>
      <div id="calendar">
      <table>
        <thead>
          <tr>
            <th>א</th>
            <th>ב</th>
            <th>ג</th>
            <th>ד</th>
            <th>ה</th>
            <th>ו</th>
            <th>ש</th>
          </tr>
        </thead>
        <tbody>
          {generateDates().reduce((rows, date, index) => {
            if (index % 7 === 0) rows.push([]);
            rows[rows.length - 1].push(date);
            return rows;
          }, []).map((week, rowIndex) => (
            <tr key={rowIndex}>
              {week.map((date, colIndex) => (
                <td key={colIndex}>
                {date && (
                  <button
                    onClick={() => handleDateClick(date)}
                    className={availableDays.includes(dateToString(date)) ? 'available-day primary-bg' : ''}
                  >
                    {date.getDate()}
                  </button>
                )}
                
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
</div>
</>
)}
</div>
);
};

export default DateSelector;