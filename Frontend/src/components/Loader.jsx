import * as React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loader() {
  return (
    <Stack
      sx={{
        color: 'grey.500',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      spacing={2}
      direction='row'
    >
      <CircularProgress color='inherit' size={60} thickness={3} />
    </Stack>
  );
}
