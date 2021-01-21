import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";

import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

import { StyledButton } from "../styledButton";

import {
  postSelector,
  savePostRequest,
  setLoading,
} from "../../store/slices/post";

export function MessageForm({ onClose }) {
  const dispatch = useDispatch();
  const { loading } = useSelector(postSelector);

  const classes = useStyles();

  const initialValues = {
    content: "write a post",
    stake: "enter amount",
  };
  const validate = (values) => {
    const errors = {};
    if (!values.content || !values.stake) {
      errors.content = "Required";
    }
    return errors;
  };
  const onSubmit = (values, { loading }) => {
    // const body = {
    //   content: values.content,
    //   author: "0x0",
    //   stake: `${values.stake}`,
    //   datetime: new Date().getTime(),
    // };
    console.log(values);
    dispatch(savePostRequest(values, onClose));
    // const pinName = `Stakepost content from ${body.author} at ${body.datetime}`;
    // pinata
    //   .pinJSONToIPFS(body, { pinataMetadata: { name: pinName } })
    //   .then((result) => {
    //     //handle results here
    //     console.log(result);
    //     alert(JSON.stringify(result, null, 2));
    //     setSubmitting(false);
    //   })
    //   .catch((err) => {
    //     //handle error here
    //     console.log(err);
    //     setSubmitting(false);
    //   });
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
                type="text"
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
