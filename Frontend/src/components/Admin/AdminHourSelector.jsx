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
import { Link, useNavigate,useLocation } from "react-router-dom";
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

  const handleAddHour = async (e) => {
    // e.preventDefault(); // Prevent default form submission
    if (newHour) {
      setLoading(true); // Start loading while adding hour
      try {
        const { data } = await axios.get(`http://localhost:5000/api/days/findDay`, {
          params: { date: formattedDate }
        });

        if (data) {
          // Day exists, update available hours
          const updatedHours = [...data.availableHours, newHour];
          await axios.put(`http://localhost:5000/api/days`, { availableHours: updatedHours, date: formattedDate });
          // window.location.reload();

        }
         
      } catch (error) {
         // Day does not exist, create a new one
        //  const newDay = {
        //   date: formattedDate,
        //   availableHours: [newHour],
        // };
        await axios.post(`http://localhost:5000/api/days/add`, {
          date: formattedDate,
          dayName,
           availableHours: [newHour]
        });
         
     
      setNewHour('');
      console.error('Error adding hour:', error);
    } finally {
        await fetchDay(); // Refresh the day's data after adding/updating
        setLoading(false); // End loading
      }
    }
  };



  // Fetch day data
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

  useEffect(() => {
    fetchDay(); // Call fetchDay when the component mounts or formattedDate changes
  }, [formattedDate]);

  const handleHourButtonClick = (hour) => {
    // setShowModal(true);
    setSelectedHour(hour)
    sessionStorage.setItem('hour', hour);
    setShowHourOptions(true)
    
  };

  const handleAddHourButtonClick = () => {
    navigate('/admin-add-hour', { state: { day } });

  };
  const handleAddlessonButtonClick = () => {
    navigate('/admin-add-lesson', { state: { day } });

  };


  const handleBack = () => {
    navigate(-1);
  };

  // Handle remove hour
  const handleRemoveHour = async () => {
    try {
      const response = await axios.put('http://localhost:5000/api/days/remove-available-hour', {
        date: formattedDate,
        hour: selectedHour,
      });


      // Refetch the updated data
      await fetchDay();
      setShowModal(false); // Close modal on success
    } catch (error) {
      console.error('Error removing hour:', error);
    }
  };


  

  return (
    <section id='admin-hour-selector'>
    <img id='top-img' src={topCover} alt="img" />

      {loading ? (
        <Loader /> // Show loader while fetching or adding data
      ) : (
        <>

          <button className='back' onClick={handleBack}><i className="fa-solid fa-angle-right"></i>חזרה</button>
          
          <h1 className='large-header'>({dayName}) {formattedDate}</h1>
          <h1 className='secondary-color'>שעות תפוסות</h1>
          <DataTable formattedDate={formattedDate} className="data-table"/>
          <h1 className='secondary-color'>שעות פנויות</h1>
          <div className='hours-container'>
          {day.availableHours && day.availableHours.length > 0 ? (
            [...day.availableHours]
              .sort((a, b) => {
                const [aHour, aMinute] = a.split(':').map(Number); // Split and convert to numbers
                const [bHour, bMinute] = b.split(':').map(Number);
                return aHour - bHour || aMinute - bMinute; // Compare hours first, then minutes
              })
              .map((hour) => (
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
        {showHourOptions && 
          <div className='same-row'>
          <Button  onClick={() => {setShowModal(true); setShowHourOptions(false)}} className='remove-bg' variant="contained">מחיקת שיעור</Button>
          <Button  onClick={handleAddlessonButtonClick} id="add-lesson-btn" className='secondary-bg' variant="contained">הוספת שיעור לתלמיד</Button>

          </div>}
        <h1 className='secondary-color'>הוספת שיעור חדש</h1>
  <Box
            component="form"
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', // Align form fields to the right
              '& > :not(style)': { m: 1, width: '25ch' } 
            }}
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
              dir="rtl" // Set the direction to right-to-left for the label
            />
            
            <Button type="submit" className='secondary-bg' variant="contained">אישור</Button>
          </Box>
          {showModal && <RemoveHourModal selectedHour={selectedHour} selectedDate={formattedDate} showModal={showModal} setShowModal={setShowModal} handleRemoveHour={handleRemoveHour}/>}
        </>
      )}
    </section>
  );
};

export default AdminHourSelector;
