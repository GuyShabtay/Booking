import React, { useState, useEffect } from 'react';
import './progressBar.css';
import topCover from '../images/top cover.jpg'


const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    // Retrieve the saved progress value from sessionStorage, if available
    const savedProgress = sessionStorage.getItem('progress');
    if (savedProgress) {
      setProgress(parseInt(savedProgress)); // Update the state with the saved value
    }
  }, []);



 // Listen for sessionStorage changes in the same tab
 const handleStorageChange = () => {
  const newValue = sessionStorage.getItem('progress');
  setProgress(newValue);
};

// Listen for sessionStorage changes across different tabs/windows
useEffect(() => {
  window.addEventListener('storage', handleStorageChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}, []);


  return (
    <div id='progress-bar'>    
    <img id='top-img' src={topCover} alt="img" />

    <div id='progress-bars'>
      <div className='progress-bar-container'>
        <div className={`progress-bar-1`}></div>
      </div>
      <div className='progress-bar-container'>
        {(sessionStorage.getItem('progress') == 2 || sessionStorage.getItem('progress') == 3 || sessionStorage.getItem('progress') == 4) && (
          <div className={`progress-bar-2`}></div>
        )}{' '}
      </div>
      <div className='progress-bar-container'>
        {(sessionStorage.getItem('progress') == 3 || sessionStorage.getItem('progress') == 4) && (
          <div className={`progress-bar-3`}></div>
        )}{' '}
      </div>
      <div className='progress-bar-container'>
        {sessionStorage.getItem('progress') == 4 && <div className='progress-bar-4'></div>}{' '}
      </div>
    </div>
    </div>
  );
};

export default ProgressBar;
