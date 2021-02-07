import React from 'react';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

const Terms = () => {
  const classes = useStyles();
  return (
    <Container maxWidth="lg" className={classes.root}>
      Terms
    </Container>
  );
};
const useStyles = makeStyles(() => ({
  root: {
    flex: '1 0 auto',
  },
}));

export default Terms;
