import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};
export default function RemoveHourModal({selectedHour,selectedDate,showModal,setShowModal,handleRemoveHour}) {
  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);


  

  return (
    <div id='remove-hour-modal'>
      <Modal
        open={showModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='shadow-box' sx={style}
        dir="rtl"
        >
        <Typography id="modal-modal-title" variant="h6" component="h2">
  האם את בטוחה שברצונך למחוק את השיעור בתאריך {selectedDate} בשעה {selectedHour} ?
</Typography>

        <div className='modal-buttons'>
        <Button type="submit" className='remove-bg' variant="contained" onClick={handleRemoveHour}>מחיקה</Button>
        <Button id='cancel-remove-hour' className='default-bg' variant="contained" onClick={handleClose}>ביטול</Button>
        </div>
        </Box>
      </Modal>
    </div>
  );
}
