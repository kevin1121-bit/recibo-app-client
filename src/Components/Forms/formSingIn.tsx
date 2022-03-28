import {
  Grid,
  Button,
  Container,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, gql } from "@apollo/client";
import { useAuth, IAuth } from "../../Context/authContext";
import { IResponseToken } from "../../InterfaceGlobals/globalsInterface";
import { useState } from "react";

const AUHT_PERSON = gql`
  mutation AuthPerson($input: AuthPersonInput!) {
    authPerson(input: $input) {
      token
      status
      username
    }
  }
`;

interface IValuesForm {
  username: string;
  password: string;
}

interface IProps {
  closeModal: () => void;
}

const validationSchema = yup.object().shape({
  username: yup.string().required("Username is required").min(3).max(100),
  password: yup.string().required("Password is required").min(4).max(100),
});

function FormLogin(props: IProps) {
  const { closeModal } = props;
  const [singInPerson, { loading, reset }] = useMutation<
    { authPerson: IResponseToken },
    { input: IValuesForm }
  >(AUHT_PERSON);
  const auth: IAuth | null = useAuth();
  const [message, setMessage] = useState<string>("");

  const handleSingIn = (values: IValuesForm) => {
    singInPerson({ variables: { input: values } })
      .then((response) => {
        if (response.data?.authPerson.status) {
          auth?.singIn(response.data.authPerson);
          closeModal();
        } else {
          setMessage("Username or password incorrect");
          reset();
        }
      })
      .catch((e) => {
        console.log(e.message);
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
      handleSingIn(values);
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
              <Typography sx={{ color: "red" }}> {message}</Typography>
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
                  "Sing In"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
}

export default FormLogin;
