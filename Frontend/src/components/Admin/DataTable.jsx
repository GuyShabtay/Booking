import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button'; // Import Button for removal action
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import '../Style.css';
import RemoveHourModal from './RemoveHourModal';



// Define RTL cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
});

// Define the theme with RTL direction
const theme = createTheme({
  direction: 'rtl',
});

// Define the columns for the DataGrid
const columns = [
  { field: 'school', headerName: 'בית ספר', width: 100, disableColumnMenu: true }, // Hebrew for "School"
  { field: 'name', headerName: 'שם', width: 90, disableColumnMenu: true }, // Hebrew for "Name"
  { field: 'hour', headerName: 'שעה', width: 80, disableColumnMenu: true }, // Hebrew for "Hour"
  { field: 'date', headerName: 'תאריך', width: 90, disableColumnMenu: true }, // Hebrew for "Date"
];

export default function DataTable({formattedDate}) {
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // State to track selected rows (IDs)
  const [showModal, setShowModal] = useState(false);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch the taken hours from the backend
const fetchTakenHours = async () => {
  try {
    const { data } = await axios.get('https://math-lessons-backend.onrender.com/api/days/taken-hours'); // Adjust the endpoint if necessary

    // Sort by date and then by hour for entries with the same date
    const sortedData = data.sort((a, b) => {
      const hourA = parseInt(a.hour.split(':')[0], 10); // Extract the hour as an integer
      const hourB = parseInt(b.hour.split(':')[0], 10);

      // Sort by hour for same date entries
      return hourA - hourB;
    });

    setRows(sortedData);
  } catch (error) {
    console.error('Error fetching taken hours:', error);
  } finally {
  }
};

const fetchFilteredHours = async () => {
  try {
    const { data } = await axios.get('https://math-lessons-backend.onrender.com/api/days/taken-hours');
    const filteredData = data.filter(row => row.date === formattedDate);

    // Sort by date and then by hour for entries with the same date
    const sortedFilteredData = filteredData.sort((a, b) => {
      const hourA = parseInt(a.hour.split(':')[0], 10); // Extract the hour as an integer
      const hourB = parseInt(b.hour.split(':')[0], 10);

      // Sort by hour for same date entries
      return hourA - hourB;
    });

    setRows(sortedFilteredData);
  } catch (error) {
    console.error('Error fetching filtered hours:', error);
  } finally {
  }
};


  useEffect(() => {
    if(formattedDate)
      fetchFilteredHours();
    else
    fetchTakenHours(); // Fetch the data when the component mounts
  }, []);

  // Handle selection change (when user selects or deselects rows)
const handleSelectionChange = (selectionModel) => {
  setSelectedRows(selectionModel); // Update selected rows state
  const hoursToRemove = selectionModel.map(rowId => {
    const row = rows.find(row => row.id === rowId);
    return { date: row.date, hour: row.hour, name: row.name, school: row.school };
  });

  setSelectedHour(hoursToRemove[0]?.hour); // Set selected hour immediately using the new selection
  setSelectedDate(hoursToRemove[0]?.date); // Set selected hour immediately using the new selection
};


  // Handle removal of selected hours
  const handleRemoveHour = async () => {

    const hoursToRemove = selectedRows.map(rowId => {
      const row = rows.find(row => row.id === rowId);
      return { date: row.date, hour: row.hour, name: row.name, school: row.school };
    });

    try {
      // Perform removal requests
      await Promise.all(hoursToRemove.map(async (hour) => {
        await axios.put('https://math-lessons-backend.onrender.com/api/days/remove-taken-hour', hour);
      }));
      setShowModal(false);


      // Refresh the entire page
      window.location.reload();
    } catch (error) {
      console.error('Error removing hours:', error);
    }
  };

  const handleHourButtonClick = () => {
    setShowModal(true);
  };

  return (
    <CacheProvider value={cacheRtl}>
    
      <ThemeProvider theme={theme}>
        <Paper
          sx={{
            width: '95%',
            borderRadius: '20px', // Rounded corners
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Shadow
            overflow: 'hidden', // Ensures the DataGrid respects the border-radius
            margin:'10px 0'
          }}
          dir="rtl"
        >
        <DataGrid
        className='data-grid'
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10]}
        disableSelectionOnClick
        sx={{
          border: 0,
          direction: 'rtl',
          '& .MuiDataGrid-columnHeaders': {
            borderRadius: '0',
          },
          '& .MuiDataGrid-cell': {
            whiteSpace: 'normal',  // Allow text to wrap
            wordWrap: 'break-word',  // Ensure long words break
            lineHeight: '1.5',  // Optional: adjust line height for better readability
          },
        }}
        onRowSelectionModelChange={(newSelection) => handleSelectionChange(newSelection)}
        selectionModel={selectedRows}
      />
      

        </Paper>

        {/* Show Remove button when one or more rows are selected */}
        {selectedRows.length > 0 && (
          <Button variant="contained" className='remove-bg' onClick={handleHourButtonClick} sx={{ mt: 2 }}>
            מחיקת שיעור
          </Button>
        )}
      </ThemeProvider>
      {showModal && <RemoveHourModal selectedHour={selectedHour} selectedDate={selectedDate} showModal={showModal} setShowModal={setShowModal} handleRemoveHour={handleRemoveHour}/>}
    </CacheProvider>
  );
}