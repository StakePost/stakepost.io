import React from "react";

import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";

import pinataSDK from "@pinata/sdk";

const pinataApi = {
  key: "ad5c872ed3ae460e0c94",
  secred: "79943a3c5a9e05eef69276441973eb05995da141fb793a97977d1008d4674a5c",
  jwt:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5NzljODQ0OC1mNGZhLTRiMTAtYTk0Zi0wNGFiYTc4OGQ4NGMiLCJlbWFpbCI6InRteXgwbTBwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2V9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJhZDVjODcyZWQzYWU0NjBlMGM5NCIsInNjb3BlZEtleVNlY3JldCI6Ijc5OTQzYTNjNWE5ZTA1ZWVmNjkyNzY0NDE5NzNlYjA1OTk1ZGExNDFmYjc5M2E5Nzk3N2QxMDA4ZDQ2NzRhNWMiLCJpYXQiOjE2MTA0NjgzOTl9.l6JdqqOOvc6ZUDkkdnlW_3bwzM100_fACLsHxFTm2RM",
};
const pinata = pinataSDK(pinataApi.key, pinataApi.secred);

export function TwitBox() {
  const classes = useStyles();
  return (
    <Paper className={classes.root} elevation={2}>
      <Formik
        initialValues={{
          message: "",
          stake: 1,
        }}
        validate={(values) => {
          const errors = {};
          if (!values.message || !values.stake) {
            errors.message = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const body = {
            message: values.message,
            author: "0x0",
            stake: `${values.stake}`,
            datetime: new Date().getTime(),
          };
          const pinName = `Stakepost message from ${body.author} at ${body.datetime}`;
          pinata
            .pinJSONToIPFS(body, { pinataMetadata: { name: pinName } })
            .then((result) => {
              //handle results here
              console.log(result);
              alert(JSON.stringify(result, null, 2));
              setSubmitting(false);
            })
            .catch((err) => {
              //handle error here
              console.log(err);
              setSubmitting(false);
            });
        }}
      >
        {({ submitForm, isSubmitting }) => (
          <Form className={classes.form}>
            {isSubmitting && <CircularProgress />}
            <Field
              component={TextField}
              name="message"
              type="text"
              label="Message"
              variant="outlined"
              multiline
              fullWidth
            />
            <Field
              component={TextField}
              type="text"
              label="Stake"
              name="stake"
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              onClick={submitForm}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}
const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: "0.125rem",
    marginBottom: "4rem",
  },
  form: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));
