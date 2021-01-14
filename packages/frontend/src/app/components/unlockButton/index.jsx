import React, { useState } from "react";
import { StyledButton } from "../styledButton";
import { UnlockModal } from "../unlockModal";

export function UnlockButton() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <>
      <StyledButton onClick={handleClickOpen}>unlock wallet</StyledButton>
      <UnlockModal open={open} onClose={handleClose} />
    </>
  );
}
