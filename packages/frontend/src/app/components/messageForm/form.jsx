import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

import { StyledButton } from "../styledButton";

import { postSelector, savePostRequest } from "../../store/slices/post";

export function MessageForm() {
  const dispatch = useDispatch();
  //const { account, image, balance } = useSelector(postSelector);

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
  const onSubmit = (values, { setSubmitting }) => {
    // const body = {
    //   content: values.content,
    //   author: "0x0",
    //   stake: `${values.stake}`,
    //   datetime: new Date().getTime(),
    // };
    console.log(values);
    dispatch(savePostRequest(values));
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
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ submitForm, isSubmitting }) => (
        <Form className={classes.form}>
          {isSubmitting && <CircularProgress />}
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
            <StyledButton disabled={isSubmitting} onClick={submitForm}>
              stake post
            </StyledButton>
          </div>
        </Form>
      )}
    </Formik>
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
  action: {
    display: "flex",
    justifyContent: "center",
  },
}));
