import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './Style.css';
import BadgeIcon from '@mui/icons-material/Badge';
import SchoolIcon from '@mui/icons-material/School';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';

const schoolOptions = ["'אורט מקיף א", "'מקיף ב", "'מקיף ד", "'מקיף ה", "'מקיף ו", "אורט רונסון", "אורט אפרידר","אומנויות"];

export default function ValidationTextFields({ updateDetails, name, setName, school, setSchool }) {
  const [errors, setErrors] = useState({
    name: false,
    school: false
  });

  const [isNameFocused, setIsNameFocused] = useState(false); // State for name input focus
  const [isSchoolFocused, setIsSchoolFocused] = useState(false); // State for school input focus
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false); // State to manage dropdown open/close

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    setOpen(newInputValue.length > 0); // Open dropdown if there's input
  };

  const handleSelectionChange = (event, value) => {
    if (value) {
      setSchool(value); // Set selected school
      setErrors({ ...errors, school: false }); // Reset error when a school is selected
      setOpen(false); // Close dropdown after selection
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      setName(value);
    }

    setErrors({
      ...errors,
      [name]: false
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: !name, // Error if name is empty
      school: !school // Error if school is not selected
    };

    setErrors(newErrors);

    if (!newErrors.name && !newErrors.school) {
      // Proceed with form submission
      updateDetails(name, school);
    }
  };

  return (
    <Box
      component="form"
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'cneter', // Align form fields to the right
        alignItems: 'center', 
        justifyContent: 'center', 
        '& > :not(style)': { m: 1, width: '25ch' } 
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      {/* Name Field */}
      <Box id="standard-basic-name1" sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          id="standard-basic-name"
          label="* שם מלא"
          variant="standard"
          name="name"
          value={name}
          onChange={handleChange}
          error={errors.name}
          helperText={errors.name ? "שם מלא הוא שדה חובה" : ""}
          dir="rtl" // Set the direction to right-to-left for the label
          onFocus={() => setIsNameFocused(true)} // Set focus state to true for name
          onBlur={() => setIsNameFocused(false)} // Set focus state to false for name
        />
        <BadgeIcon sx={{ color: isNameFocused ? '#1976d2' : 'gray', ml: 1 }} /> {/* Change color based on name focus */}
      </Box>

     {/* School Field */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Stack dir="rtl" spacing={1} sx={{ width: 300 }}>
          <Autocomplete
            id="auto-highlight"
            autoHighlight
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onChange={handleSelectionChange}
            options={schoolOptions} // Use the static options
            noOptionsText="אין תוצאות" // Custom message for no options
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="* בית ספר" 
                variant="standard"
                error={errors.school} // Show red border if school is not selected
                helperText={errors.school ? "בית ספר הוא שדה חובה" : ""} // Error message
                InputProps={{ 
                  ...params.InputProps, 
                  onFocus: () => setIsSchoolFocused(true), // Set focus state to true for school
                  onBlur: () => setIsSchoolFocused(false) // Set focus state to false for school
                }}
              />
            )}
            open={open} // Control dropdown open state
            disableClearable // Disable the clearable feature
          />
        </Stack>
        <SchoolIcon sx={{ color: isSchoolFocused ? '#1976d2' : 'gray', ml: 1 }} /> {/* Change color based on school focus */}
      </Box>
      
      <Button type="submit" id="confirm-login" className="default-bg" variant="contained">אישור</Button>
    </Box>
  );
}
