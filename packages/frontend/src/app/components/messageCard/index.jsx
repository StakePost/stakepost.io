import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import StarIcon from "@material-ui/icons/Star";
import TwitterIcon from "@material-ui/icons/Twitter";
import ShareIcon from "@material-ui/icons/Share";

export function MessageCard(props) {
  const { pinned } = props;
  const classes = useStyles(props);
  return (
    <Card className={classes.root} raised elevation={2} square>
      <CardHeader
        action={
          pinned && (
            <IconButton aria-label="pin" disabled>
              <StarIcon color="secondary" />
            </IconButton>
          )
        }
        disableTypography
        title="10.0090220 ETH"
        className={classes.header}
      />
      <CardContent className={classes.content}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit quos
        excepturi asperiores nam ea quidem omnis vitae repudiandae voluptates
        ipsam fugit cumque saepe, inventore sed consectetur quis porro eius
        molestiae!
      </CardContent>
      <CardActions className={classes.actions}>
        <div className={classes.datetime}>28 Dec 2020</div>
        <IconButton aria-label="Share Twitter" className={classes.actionIcon}>
          <TwitterIcon />
        </IconButton>
        <IconButton aria-label="Share Link" className={classes.actionIcon}>
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
const useStyles = makeStyles({
  root: {
    minWidth: 275,
    borderRadius: "0.125rem",
    marginBottom: (props) => (props.pinned ? "4rem" : "2rem"),
  },
  header: {
    fontFamily: '"Inter", sans-serif',
    fontSize: "1.125rem",
    fontWeight: "bold",
  },
  content: {
    padding: "0.5rem 1rem",
    fontSize: "1.25rem",
  },
  actions: {
    padding: "0.5rem 1rem",
  },
  datetime: {
    marginRight: "auto",
    color: "#848484",
  },
  actionIcon: {
    marginLeft: "auto",
  },
});
