import React, { useEffect, useState } from 'react';
import horison from '../images/horizon.png';
import axios from 'axios';
import schoolBoard from '../images/school board.gif'; 


const NextLessons = () => {
  const [takenLessons, setTakenLessons] = useState([]); // Store the user's taken lessons
  const [loading, setLoading] = useState(true); // Loading state

  const storedName = localStorage.getItem('name');
  const storedSchool = localStorage.getItem('school');

  useEffect(() => {
    // Fetch taken hours and filter by user name
    // setLoading(true); // Start loading

    if (storedName && storedSchool) {
      axios.get('https://math-lessons-backend.onrender.com/api/days/taken-hours')
        .then((response) => {
          const lessons = response.data.filter(lesson => lesson.name === storedName && lesson.school === storedSchool);
          setTakenLessons(lessons);
          setLoading(false); // Start loading
        })
        .catch((error) => {
          console.error('Error fetching taken hours:', error);
        });
    }

  }, []);

  return (
    <>
    {!loading && (
    
      
    <div id='next-lessons' className='shadow-box'>
    {takenLessons.length > 0 && 
    <img id='lesson-gif' src={schoolBoard} alt="img" />}
      <h1 className='small-header'>,היי {storedName}</h1>
      {takenLessons.length > 0 ? (
        <div id='next-lessons-container'>
          <h3>:השיעורים הבאים שלך</h3>
         
          <div >
            {takenLessons.map((lesson, index) => (
              <div key={index} className='shadow-box lesson primary-bg'>
              <div id="lesson-details">
              <div className='same-row'>
                <p>({lesson.dayName})</p>
                <p>{lesson.date} <strong>:תאריך</strong></p>
              </div>
              <p><strong>שעה:</strong> {lesson.hour}</p>
            </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div id='sunset-container'>
          <img id='sunset-img' src={horison} alt="img" />
          <p id='no-new-lessons'>כרגע אין לך שיעורים חדשים באופק</p>
        </div>
      )}
    </div>
  ) }
  </>
  );
};

export default NextLessons;
