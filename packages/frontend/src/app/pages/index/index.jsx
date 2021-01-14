import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { TwitBox } from "../../components/twitbox";
import { MessageList } from "../../components/messageList";

export function Index() {
  const classes = useStyles();
  return (
    <Container maxWidth="lg" className={classes.root}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item xs={12} sm={6}>
          <TwitBox />
        </Grid>
        <Grid item xs={12} sm={6}>
          <MessageList />
        </Grid>
      </Grid>
    </Container>
  );
}
const useStyles = makeStyles((theme) => ({
  root: {
    flex: "1 0 auto",
  },
}));
