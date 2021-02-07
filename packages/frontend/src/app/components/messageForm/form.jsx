import React from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useWeb3React } from '@web3-react/core';

import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';

import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import StyledButton from '../styledButton';
import { isTokenExpired } from '../../../utils';

import { setLoading, createPostRequest } from '../../store/slices/post';
import { refreshRequest } from '../../store/slices/auth';
import { showAlert } from '../../store/slices/alert';

import ethService from '../../api/eth';

const MessageForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { library } = useWeb3React();
  const { loading } = useSelector((state) => state.post);
  const { account, balance } = useSelector((state) => state.eth);
  const { data } = useSelector((state) => state.auth);

  const classes = useStyles();

  const initialValues = {
    content: 'write a post',
    stake: 1,
  };
  const validate = (values) => {
    const errors = {};
    if (!values.content) {
      errors.content = 'Required';
    }
    if (values.length > 250) {
      errors.content = 'Max symbols exceed';
    }

    if (!values.stake) {
      errors.stake = 'Required';
    }
    if (values.stake <= 0) {
      errors.stake = 'Stake should be positive';
    }
    if (values.stake > balance) {
      errors.stake = 'Stake should be less then balance';
    }

    return errors;
  };
  const onSubmit = async (values) => {
    try {
      if (isTokenExpired(data.token)) {
        const refreshAction = await dispatch(refreshRequest());
        unwrapResult(refreshAction);
      }

      const { hash } = await ethService.sendStakeAndPostTx(
        { account, content: values.content, stake: values.stake },
        library,
      );
      values.txHash = hash;

      const createAction = await dispatch(createPostRequest(values));
      unwrapResult(createAction);

      onClose();
    } catch (e) {
      dispatch(showAlert(e.message));
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
        {({ submitForm, submitting }) => (
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
              <StyledButton disabled={submitting} onClick={submitForm}>
                stake post
              </StyledButton>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};
const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: '0.125rem',
    marginBottom: '4rem',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      margin: theme.spacing(2),
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  action: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

MessageForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default MessageForm;
