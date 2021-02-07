import React, { useState } from 'react';
import StyledButton from '../styledButton';
import UnlockModal from '../unlockModal';

const UnlockButton = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <StyledButton onClick={handleClickOpen}>unlock wallet</StyledButton>
      <UnlockModal open={open} onClose={handleClose} />
    </>
  );
};

export default UnlockButton;
