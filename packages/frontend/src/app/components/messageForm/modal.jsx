import React from "react";

import { useWeb3React } from "@web3-react/core";

import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import { StyledModal } from "../styledModal";

import { MessageForm } from "./form";

export function MessageFormModal({ onClose, open }) {
  const classes = useStyles();
  const { active } = useWeb3React();

  const handleClose = () => {
    onClose();
  };

  return (
    <StyledModal onClose={handleClose} open={open} title="Stake and Post">
      <div className={classes.modalContent}>
        <MessageForm />
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
//   const classes = useStyles();

//   return (
//     <Paper className={classes.root} elevation={2}>
//       <Formik
//         initialValues={{
//           message: "",
//           stake: 1,
//         }}
//         validate={(values) => {
//           const errors = {};
//           if (!values.message || !values.stake) {
//             errors.message = "Required";
//           }
//           return errors;
//         }}
//         onSubmit={(values, { setSubmitting }) => {
//           const body = {
//             message: values.message,
//             author: "0x0",
//             stake: `${values.stake}`,
//             datetime: new Date().getTime(),
//           };
//           console.log(body);
//           // const pinName = `Stakepost message from ${body.author} at ${body.datetime}`;
//           // pinata
//           //   .pinJSONToIPFS(body, { pinataMetadata: { name: pinName } })
//           //   .then((result) => {
//           //     //handle results here
//           //     console.log(result);
//           //     alert(JSON.stringify(result, null, 2));
//           //     setSubmitting(false);
//           //   })
//           //   .catch((err) => {
//           //     //handle error here
//           //     console.log(err);
//           //     setSubmitting(false);
//           //   });
//         }}
//       >
//         {({ submitForm, isSubmitting }) => (
//           <Form className={classes.form}>
//             {isSubmitting && <CircularProgress />}
//             <div>
//               <Field
//                 component={TextField}
//                 name="message"
//                 type="text"
//                 label="Message"
//                 variant="outlined"
//                 multiline
//                 rows="4"
//                 fullWidth
//               />
//             </div>
//             <div>
//               <Field
//                 component={TextField}
//                 type="text"
//                 label="Stake"
//                 name="stake"
//                 variant="outlined"
//               />
//             </div>
//             <div>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 disabled={isSubmitting}
//                 onClick={submitForm}
//               >
//                 Submit
//               </Button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </Paper>
//   );
// }
// const useStyles = makeStyles((theme) => ({
//   root: {
//     borderRadius: "0.125rem",
//     marginBottom: "4rem",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     "& > *": {
//       margin: theme.spacing(2),
//     },
//   },
// }));
