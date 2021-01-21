import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import HashGenerator from "ipfs-only-hash";

import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";

import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

import { StyledButton } from "../styledButton";
import { delIPFSPrefix } from "../../../utils";

import {
  postSelector,
  savePostRequest,
  setLoading,
} from "../../store/slices/post";

import { ethSelector } from "../../store/slices/eth";

import config from "../../config";

export function MessageForm({ onClose }) {
  const dispatch = useDispatch();
  const { library } = useWeb3React();
  const { loading } = useSelector(postSelector);
  const { account, balance } = useSelector(ethSelector);

  const classes = useStyles();

  const initialValues = {
    content: "write a post",
    stake: 1,
  };
  const validate = (values) => {
    const errors = {};
    if (!values.content) {
      errors.content = "Required";
    }
    if (values.length > 250) {
      errors.content = "Max symbols exceed";
    }

    if (!values.stake) {
      errors.stake = "Required";
    }
    if (values.stake <= 0) {
      errors.stake = "Stake should be positive";
    }
    if (values.stake > balance) {
      errors.stake = "Stake should be less then balance";
    }

    return errors;
  };
  const onSubmit = (values, { loading }) => {
    stakePost(values.content, account, values.stake)
      .then((result) => {
        values.txHash = result.hash;
        dispatch(savePostRequest(values, onClose));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const stakePost = async (content, author, stake) => {
    try {
      const contract = new ethers.Contract(
        config.StakepostContractAt,
        config.StakepostContractAbi,
        library.getSigner(account)
      );

      const postContent = JSON.stringify({ content, author, stake });
      const data = Buffer.from(postContent);
      const hash = await HashGenerator.of(data);
      const encoded = ethers.utils.hexlify(ethers.utils.base58.decode(hash));
      const postHash = delIPFSPrefix(encoded);
      const response = await contract.stakeAndPost(postHash, {
        value: ethers.utils.parseEther(stake.toString()),
      });
      return response;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {loading && (
        <Backdrop
          className={classes.backdrop}
          open={loading}
          onClick={() => {
            dispatch(setLoading(false));
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({ submitForm, loading }) => (
          <Form className={classes.form}>
            <div className={classes.content}>
              <Field
                component={TextField}
                name="content"
                type="text"
                label="post"
                multiline
                rows="4"
                fullWidth
              />
            </div>
            <div className={classes.stake}>
              <Field
                component={TextField}
                type="number"
                label="stake"
                name="stake"
                fullWidth
              />
            </div>
            <div className={classes.action}>
              <StyledButton disabled={loading} onClick={submitForm}>
                stake post
              </StyledButton>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "0.125rem",
    marginBottom: "4rem",
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    "& > *": {
      margin: theme.spacing(2),
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  action: {
    display: "flex",
    justifyContent: "center",
  },
}));
