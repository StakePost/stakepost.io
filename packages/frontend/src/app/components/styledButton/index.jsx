import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const StyledButton = ({ onClick, children, ...rest }) => {
  const classes = useStyles();
  return (
    <Button
      className={classes.root}
      variant="contained"
      disableElevation
      onClick={onClick}
      {...rest}
    >
      {children}
    </Button>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    color: 'white',
    backgroundColor: '#141414',
    textTransform: 'none',
    fontFamily: "'Roboto Slab', serif",
    fontWeight: '900',
    fontSize: '1rem',
    lineHeight: '1.3125rem',
    '&:hover': {
      backgroundColor: '#191919',
    },
    borderRadius: 2,
  },
}));

StyledButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};

export default StyledButton;
