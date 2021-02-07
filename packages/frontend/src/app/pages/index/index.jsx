import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import MessageFormWrapper from '../../components/messageForm/wrapper';
import MessageList from '../../components/messageList';

const Index = () => {
  const classes = useStyles();
  return (
    <Container maxWidth="lg" className={classes.root}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item xs={12} sm={6} className={classes.fullWidth}>
          <MessageFormWrapper />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.fullWidth}>
          <MessageList />
        </Grid>
      </Grid>
    </Container>
  );
};
const useStyles = makeStyles(() => ({
  root: {
    flex: '1 0 auto',
  },
  fullWidth: {
    width: '100%',
  },
}));

export default Index;
