import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import { Box } from '@mui/material';

export default function NFTPopup({isOpen, onClose, uri}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(()=>{
      setOpen(isOpen);
  },[isOpen])

  const handleClose = () => {
    onClose();
    setOpen(false);
  };

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
            style: {
                boxShadow: '#f3b7e6 0px 0 20px 0px',
                transition: 'all 0.3s ease-in',
                transform: 'scale(1)',
            },
        }}
      >
        <Box className="card-view-container" component="img" src={uri} width="300px" height="300px" borderRadius={'8px'} />
      </Dialog>
  );
}