import React from "react";

import { useWeb3React } from "@web3-react/core";

import { injected } from "../../store/connectors";

import { makeStyles } from "@material-ui/core/styles";

import { StyledModal } from "../styledModal";
import { ProviderCard } from "../providerCard";

import MetamaskIcon from "../../assets/metamaskIcon.png";
import WallectConnectIcon from "../../assets/walletconnectIcon.png";

export function UnlockModal({ onClose, open }) {
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
      showActions={true}
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
          disabled={true}
        />
      </div>
    </StyledModal>
  );
}

const useStyles = makeStyles((theme) => ({
  modalContent: {
    display: "flex",
    justifyContent: "space-around",
  },
}));
