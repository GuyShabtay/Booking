import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from './DataTable'; // Assuming DataTable is in the same directory

export default function DateDataTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const formattedDate = sessionStorage.getItem('formatted-date');


  // Fetch the data and filter it by the selected date
  const fetchFilteredHours = async () => {
    try {
      const { data } = await axios.get('/api/days/taken-hours');
      const filteredData = data.filter(row => row.date === formattedDate);
      setRows(filteredData);
      console.log(filteredData)
    } catch (error) {
      console.error('Error fetching filtered hours:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredHours(); // Fetch data when the selected date changes
  }, []);

  return (
    <DataTable rows={rows} setRows={setRows} loading={loading} />
  );
}
