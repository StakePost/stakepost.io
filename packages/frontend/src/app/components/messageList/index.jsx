import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { MessageCard } from "../messageCard";

export function MessageList() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <MessageCard pinned />
      <MessageCard />
      <MessageCard />
    </div>
  );
}
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
}));
