import { useState } from "react";
import {
  Grid,
  Button,
  Container,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, gql } from "@apollo/client";
import Alert, { IAlert } from "../Alert/alert";
import { IResponse } from "../../InterfaceGlobals/globalsInterface";

const PERSON_SIGUP = gql`
  mutation CreatePerson($input: SavePersonInput!) {
    createPerson(input: $input) {
      status
      message
    }
  }
`;

interface IValuesForm {
  username: string;
  password: string;
}

const validationSchema = yup.object().shape({
  username: yup.string().required("Username is required").min(3).max(100),
  password: yup.string().required("Password is required").min(4).max(100),
});

function FormSingUp() {
  const [singUpPerson, { loading, reset }] = useMutation<
    { createPerson: IResponse },
    { input: IValuesForm }
  >(PERSON_SIGUP);
  const [alert, setAlert] = useState<IAlert>({
    message: "",
    severty: undefined,
    open: false,
  });

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      open: false,
    });
  };

  const handleSingUp = (values: IValuesForm) => {
    singUpPerson({ variables: { input: values } })
      .then((response) => {
        if (response.data?.createPerson.status) {
          setAlert({
            message: response.data.createPerson.message,
            open: true,
            severty: "success",
          });
          formik.resetForm();
        } else if (response.data) {
          setAlert({
            message: response?.data?.createPerson.message,
            open: true,
            severty: "error",
          });
          reset();
        }
      })
      .catch((e) => {
        setAlert({
          message: "Error, try again later",
          open: true,
          severty: "error",
        });
        reset();
      });
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values: IValuesForm) => {
      handleSingUp(values);
    },
  });

  return (
    <>
      <Container>
        <form onSubmit={formik.handleSubmit}>
          <Grid container direction='row' spacing={2} justifyContent='center'>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id='username'
                label='Username'
                name='username'
                variant='outlined'
                value={formik.values.username}
                onChange={formik.handleChange}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id='password'
                type='password'
                label='Password'
                name='password'
                variant='outlined'
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button
                type='submit'
                variant='outlined'
                disabled={!formik.isValid}
                sx={{ width: "160px" }}>
                {loading ? (
                  <Box display='flex'>
                    <CircularProgress color='success' size={35} />
                  </Box>
                ) : (
                  "Sing Up"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
      <Alert
        onClose={handleCloseAlert}
        message={alert.message}
        open={alert.open}
        severty={alert.severty}
      />
    </>
  );
}

export default FormSingUp;
