import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';
import TwitterIcon from '@material-ui/icons/Twitter';
import ShareIcon from '@material-ui/icons/Share';

import config from '../../config';

const MessageCard = ({ pinned, hash, stake, createdAt, children }) => {
  const classes = useStyles(pinned);
  return (
    <Card className={classes.root} raised elevation={3} square>
      <CardHeader
        action={
          pinned && (
            <IconButton aria-label="pin" disabled>
              <StarIcon color="secondary" />
            </IconButton>
          )
        }
        disableTypography
        title={`${Number(stake).toFixed(2)} ETH`}
        className={classes.header}
      />
      <CardContent className={classes.content}>{children}</CardContent>
      <CardActions className={classes.actions}>
        <div className={classes.datetime}>
          {DateTime.fromISO(createdAt).toLocaleString(DateTime.DATETIME_MED)}
        </div>
        <IconButton aria-label="Share Twitter" className={classes.actionIcon}>
          <TwitterIcon />
        </IconButton>
        <IconButton
          href={config.IPFSGatewayUri + hash}
          aria-label="Share Link"
          className={classes.actionIcon}
        >
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    borderRadius: '0.125rem',
    marginBottom: (pinned) => (pinned ? '4rem' : '2rem'),
  },
  header: {
    fontFamily: '"Inter", sans-serif',
    fontSize: '1.125rem',
    fontWeight: 'bold',
  },
  content: {
    padding: '0.5rem 1rem',
    fontSize: '1.25rem',
  },
  actions: {
    padding: '0.5rem 1rem',
  },
  datetime: {
    marginRight: 'auto',
    color: '#848484',
  },
  actionIcon: {
    marginLeft: 'auto',
  },
});

MessageCard.propTypes = {
  pinned: PropTypes.bool.isRequired,
  hash: PropTypes.string.isRequired,
  stake: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

export default MessageCard;
