import React from 'react';
import PropTypes from 'prop-types';

import { useWeb3React } from '@web3-react/core';
import { makeStyles } from '@material-ui/core/styles';

import { injected } from '../../store/connectors';
import StyledModal from '../styledModal';
import ProviderCard from '../providerCard';
import MetamaskIcon from '../../assets/metamaskIcon.png';
import WallectConnectIcon from '../../assets/walletconnectIcon.png';

const UnlockModal = ({ onClose, open }) => {
  const classes = useStyles();
  const { active } = useWeb3React();

  const handleClose = () => {
    onClose();
  };

  return (
    <StyledModal
      onClose={handleClose}
      open={open}
      title="Select wallet provider"
      showActions
    >
      <div className={classes.modalContent}>
        <ProviderCard
          title="metamask"
          icon={MetamaskIcon}
          btnTitle="connect"
          disabled={false}
          provider={injected}
          active={active}
        />
        <ProviderCard
          title="Wallet Connect"
          icon={WallectConnectIcon}
          btnTitle="soon"
          disabled
          provider={undefined}
          active={false}
        />
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

UnlockModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default UnlockModal;
