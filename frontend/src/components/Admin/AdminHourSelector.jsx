import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import Summary from '../Summary';
import '../Style.css';
import axios from 'axios';
import Button from '@mui/material/Button';
import Loader from '../Loader'; // Ensure you have the Loader component available
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Link, useNavigate, useLocation } from "react-router-dom";
import topCover from '../../images/top cover.jpg';
import DataTable from './DataTable';
import RemoveHourModal from './RemoveHourModal';

const AdminHourSelector = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [day, setDay] = useState({ availableHours: [] });
  const [newHour, setNewHour] = useState('');
  const [showHourOptions, setShowHourOptions] = useState(false);
  const formattedDate = sessionStorage.getItem('formatted-date');
  const dayName = sessionStorage.getItem('day-name');
  const navigate = useNavigate();
  const location = useLocation();

  // Function to sort time strings numerically
  const sortHours = (hours) => {
    return hours.sort((a, b) => {
      const [aHour, aMinute] = a.split(':').map(Number);
      const [bHour, bMinute] = b.split(':').map(Number);
      return aHour - bHour || aMinute - bMinute;
    });
  };

  const handleAddHour = async (e) => {
    e.preventDefault(); // Prevent form submission default behavior
    if (newHour) {
      setLoading(true); // Start loading while adding hour
      try {
        const { data } = await axios.get(`https://math-lessons-backend.onrender.com/api/days/findDay`, {
          params: { date: formattedDate }
        });
  
        if (data) {
          const updatedHours = [...data.availableHours, newHour];
          await axios.put(`https://math-lessons-backend.onrender.com/api/days`, { availableHours: updatedHours, date: formattedDate });
        } 
      } catch (error) {
        await axios.post(`https://math-lessons-backend.onrender.com/api/days/add`, {
          date: formattedDate,
          dayName,
          availableHours: [newHour]
        });
      } finally {
        await fetchDay(); // Refresh the day's data after adding/updating
        setLoading(false); // End loading
        setNewHour(''); // Clear the input field after adding the new hour
      }
    }
  };
  

  // Fetch day data
  const fetchDay = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://math-lessons-backend.onrender.com/api/days/findDay`, {
        params: { date: formattedDate }
      });
      setDay(data || { availableHours: [] });
    } catch (error) {
      setDay({ availableHours: [] });
      console.error('Error fetching day:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDay();
  }, [formattedDate]);

  const handleHourButtonClick = (hour) => {
    setSelectedHour(hour);
    sessionStorage.setItem('hour', hour);
    setShowHourOptions(true);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleRemoveHour = async () => {
    try {
      await axios.put('https://math-lessons-backend.onrender.com/api/days/remove-available-hour', {
        date: formattedDate,
        hour: selectedHour,
      });
      await fetchDay();
      setShowModal(false);
    } catch (error) {
      console.error('Error removing hour:', error);
    }
  };

  return (
    <section id='admin-hour-selector'>
      <img id='top-img' src={topCover} alt="img" />
      {loading ? (
        <Loader />
      ) : (
        <>
          <button className='back' onClick={handleBack}><i className="fa-solid fa-angle-right"></i>חזרה</button>
          <h1 className='large-header'>({dayName}) {formattedDate}</h1>
          <h1 className='secondary-color'>שעות תפוסות</h1>
          <DataTable formattedDate={formattedDate} className="data-table" />
          
          <h1 className='secondary-color'>שעות פנויות</h1>
          <div className='hours-container' style={{ direction: 'rtl' }}> {/* Ensure right-to-left layout */}
            {day.availableHours.length > 0 ? (
              sortHours(day.availableHours).map((hour) => (
                <div key={hour}>
                  <Button className='default-bg' variant="contained" onClick={() => handleHourButtonClick(hour)}>
                    {hour}
                  </Button>
                </div>
              ))
            ) : (
              <h3>אין שיעורים פנויים ביום זה</h3>
            )}
          </div>

          {showHourOptions && (
            <div className='same-row'>
              <Button onClick={() => { setShowModal(true); setShowHourOptions(false); }} className='remove-bg' variant="contained">מחיקת שיעור</Button>
              <Button onClick={() => navigate('/admin-add-lesson', { state: { day } })} id='add-lesson-btn' className='secondary-bg' variant="contained">הוספת שיעור לתלמיד</Button>
            </div>
          )}

          <h1 className='secondary-color'>הוספת שיעור חדש</h1>
          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', '& > :not(style)': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
            onSubmit={handleAddHour}
          >
            <TextField
              id="outlined-basic"
              label="* שעת שיעור"
              variant="outlined"
              name="newHour"
              value={newHour}
              onChange={(e) => setNewHour(e.target.value)}
              dir="rtl"
            />
            <Button type="submit" className='secondary-bg' variant="contained">אישור</Button>
          </Box>

          {showModal && (
            <RemoveHourModal
              selectedHour={selectedHour}
              selectedDate={formattedDate}
              showModal={showModal}
              setShowModal={setShowModal}
              handleRemoveHour={handleRemoveHour}
            />
          )}
        </>
      )}
    </section>
  );
};

export default AdminHourSelector;
