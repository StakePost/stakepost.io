import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

import StyledModal from '../styledModal';
import MessageForm from './form';

const MessageFormModal = ({ onClose, open }) => {
  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  return (
    <StyledModal onClose={handleClose} open={open} title="Stake and Post">
      <div className={classes.modalContent}>
        <MessageForm onClose={handleClose} />
      </div>
    </StyledModal>
  );
};

const useStyles = makeStyles(() => ({
  modalContent: {
    display: 'flex',
    justifyContent: 'space-around',
  },
}));

MessageFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MessageFormModal;
