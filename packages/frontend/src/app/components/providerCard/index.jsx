import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useWeb3React } from '@web3-react/core';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import StyledButton from '../styledButton';
import { useEagerConnect, useInactiveListener } from '../../hooks';

const ProviderCard = ({
  title,
  icon,
  btnTitle,
  disabled,
  provider,
  active,
}) => {
  const classes = useStyles();
  const { connector, activate } = useWeb3React();

  const [activating, setActivating] = useState();
  useEffect(() => {
    if (activating && activating === connector) {
      setActivating(undefined);
    }
  }, [activating, connector]);

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager || !!activating);

  return (
    <Card className={classes.root} elevation={0} variant="outlined">
      <CardContent className={classes.content}>
        <div>
          <img alt={title} src={icon} height={80} />
        </div>
        <Typography className={classes.title} gutterBottom>
          {title}
        </Typography>
      </CardContent>
      <CardActions>
        <div className={classes.wrapper}>
          <StyledButton
            disabled={disabled || activating || active}
            onClick={() => {
              setActivating(provider);
              activate(provider);
            }}
          >
            {btnTitle}
          </StyledButton>
          {activating === provider && !disabled && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
      </CardActions>
    </Card>
  );
};

const useStyles = makeStyles({
  root: {
    height: 250,
    width: 200,
    borderColor: (disabled) => (disabled ? '#C2C2C2' : 'black'),
    backgroundColor: (active) => (active ? 'green' : 'transparent'),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'black',
    textTransform: 'uppercase',
  },
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

ProviderCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  btnTitle: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  provider: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
};

export default ProviderCard;
