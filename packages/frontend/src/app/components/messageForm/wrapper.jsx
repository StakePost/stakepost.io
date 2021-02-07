import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MessageFormModal from './modal';

const MessageFormWrapper = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={classes.title}>
        ✨ outbid and be at the top of all posts ✨
      </div>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.wrapper}>
          <TextField
            label="write a post"
            fullWidth
            margin="dense"
            className={classes.textButton}
            onClick={handleClickOpen}
          />
        </div>
      </Paper>
      <MessageFormModal open={open} onClose={handleClose} />
    </>
  );
};
const useStyles = makeStyles(() => ({
  title: {
    margin: '2rem 0 1rem 0',
    fontSize: '1.5rem',
    fontWeight: '700',
    fontStyle: 'italic',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;',
  },
  paper: {
    borderRadius: '0.125rem',
    margin: '2rem 0',
  },
  wrapper: {
    padding: '0.5rem',
  },
}));

export default MessageFormWrapper;
