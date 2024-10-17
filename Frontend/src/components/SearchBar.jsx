import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import BadgeIcon from '@mui/icons-material/Badge';

const drinkOptions = ['מקיף א', 'מקיף ב', 'מקיף ד', 'מקיף ה', 'מקיף ו', 'רונסון', 'אורט אפרידר'];

const SearchBar = () => {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false); // State to manage dropdown open/close

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    setOpen(newInputValue.length > 0); // Open dropdown if there's input
  };

  const handleSelectionChange = (event, value) => {
    if (value) {
      setInputValue(value); // Set the input value to the selected option
      setOpen(false); // Close dropdown after selection
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'end' }}>
      <Stack dir="rtl" spacing={1} sx={{ width: 300 }}>
        <Autocomplete
          id='auto-highlight'
          autoHighlight
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onChange={handleSelectionChange}
          options={drinkOptions} // Use the static options
          renderInput={(params) => (
            <TextField 
              {...params} 
              label='* בית ספר' 
              variant='standard' 
              InputProps={{ ...params.InputProps, disableClearable: true }} // Disable clearable
            />
          )}
          open={open} // Control dropdown open state
          disableClearable // Disable the clearable feature
        />
      </Stack>
    </div>
  );
};

export default SearchBar;
