import { useReducer } from "react";
import {
  Grid,
  Button,
  Container,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { useAuth, IAuth } from "../../Context/authContext";
import {
  IDataReciept,
  IResponse,
} from "../../InterfaceGlobals/globalsInterface";
import Alert, { IAlert } from "../Alert/alert";

const CREATE_RECEIPT = gql`
  mutation CreateReceipt($input: CreateReceiptInput!) {
    createReceipt(input: $input) {
      status
      message
    }
  }
`;

const MODIFIED_RECEIPT = gql`
  mutation ModifiedReceipt($input: ModifiedReceiptInput!) {
    modifiedReceipt(input: $input) {
      status
      message
    }
  }
`;

interface IValuesForm {
  title: string;
  peso?: number;
  price: number;
  unitPrice?: number;
  address: string;
}

interface ICreateReceiptInput extends IValuesForm {
  username: string;
}

interface IModifiedReceiptInput extends IValuesForm, ICreateReceiptInput {
  idPublic: string;
}

const initialState: IAlert = {
  open: false,
  message: "",
  severty: undefined,
};

type IActionType = {
  type: "CHANGE_ALERT";
  payload: IAlert;
};

interface IProps {
  close: () => void;
  onEdit: boolean;
  valuesForm?: IDataReciept;
}

const reducerAlert = (state: IAlert, action: IActionType) => {
  if (action.type === "CHANGE_ALERT") {
    return {
      ...state,
      open: action.payload.open,
      message: action.payload.message,
      severty: action.payload.severty,
    };
  } else {
    return state;
  }
};

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  peso: yup.number(),
  price: yup.number().positive().required("Price is required"),
  unitPrice: yup.number(),
  address: yup.string(),
});

function FormAddReceipt(props: IProps) {
  const { close, valuesForm, onEdit } = props;
  const auth: IAuth | null = useAuth();
  const [alertState, dispatch] = useReducer(reducerAlert, initialState);
  const formik = useFormik({
    initialValues: onEdit
      ? {
          title: valuesForm!.title || "",
          price: valuesForm!.price || 0,
          address: valuesForm!.address || "",
          peso: valuesForm?.peso || 0,
          unitPrice: valuesForm?.unitPrice || 0,
        }
      : {
          title: "",
          price: 0,
          address: "",
          peso: 0,
          unitPrice: 0,
        },
    validationSchema: validationSchema,
    onSubmit: (values: IValuesForm) => handleSubmitForm(values),
  });
  const [receipCreate, { reset, loading }] = useMutation<
    { createReceipt: IResponse },
    {
      input: ICreateReceiptInput;
    }
  >(CREATE_RECEIPT);
  const [recieptModified, { reset: reset2, loading: loading2 }] = useMutation<
    { modifiedReceipt: IResponse },
    { input: ICreateReceiptInput }
  >(MODIFIED_RECEIPT);

  const handleSubmitForm = (values: IValuesForm) => {
    if (auth?.authState.isAuth && auth.authState.user.username) {
      if (!onEdit) {
        const input: ICreateReceiptInput = {
          ...values,
          username: auth.authState.user.username,
        };
        receipCreate({ variables: { input: input } })
          .then((res) => {
            if (res.data?.createReceipt.status) {
              dispatch({
                type: "CHANGE_ALERT",
                payload: {
                  open: true,
                  message: "receipt added successfully",
                  severty: "success",
                },
              });
              setTimeout(() => {
                close();
              }, 2000);
            } else if (res.data?.createReceipt) {
              dispatch({
                type: "CHANGE_ALERT",
                payload: {
                  open: true,
                  message: res.data?.createReceipt.message,
                  severty: "error",
                },
              });
              reset();
            } else {
              dispatch({
                type: "CHANGE_ALERT",
                payload: {
                  open: true,
                  message: "Error, try again later",
                  severty: "error",
                },
              });
              reset();
            }
          })
          .catch((err) => {
            console.log(err.message);
            dispatch({
              type: "CHANGE_ALERT",
              payload: {
                open: true,
                message: "Error, try again later",
                severty: "error",
              },
            });
            reset();
          });
      } else if (valuesForm) {
        const input: IModifiedReceiptInput = {
          ...values,
          idPublic: valuesForm.idPublic,
          username: auth.authState.user.username,
        };
        recieptModified({ variables: { input: input } })
          .then((response) => {
            if (response.data?.modifiedReceipt.status) {
              dispatch({
                type: "CHANGE_ALERT",
                payload: {
                  open: true,
                  message: "receipt modified successfully",
                  severty: "success",
                },
              });
              setTimeout(() => {
                close();
              }, 2000);
            } else if (response.data?.modifiedReceipt) {
              dispatch({
                type: "CHANGE_ALERT",
                payload: {
                  open: true,
                  message: response.data?.modifiedReceipt.message,
                  severty: "error",
                },
              });
              reset2();
            } else {
              dispatch({
                type: "CHANGE_ALERT",
                payload: {
                  open: true,
                  message: "Error, try again later",
                  severty: "error",
                },
              });
              reset2();
            }
          })
          .catch(() => {
            dispatch({
              type: "CHANGE_ALERT",
              payload: {
                open: true,
                message: "Error, try again later",
                severty: "error",
              },
            });
            reset2();
          });
      }
    } else {
      console.log(auth);
      dispatch({
        type: "CHANGE_ALERT",
        payload: {
          open: true,
          message: "Unauthenticated user",
          severty: "error",
        },
      });
    }
  };

  const handleCloseAlert = () => {
    dispatch({
      type: "CHANGE_ALERT",
      payload: { open: false, message: "", severty: undefined },
    });
  };

  return (
    <>
      <Container>
        <form onSubmit={formik.handleSubmit}>
          <Grid container direction='row' spacing={2} justifyContent='center'>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id='title'
                label='Title*'
                name='title'
                variant='outlined'
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id='peso'
                label='Peso'
                name='peso'
                type='number'
                variant='outlined'
                value={formik?.values?.peso}
                onChange={formik.handleChange}
                error={formik.touched.peso && Boolean(formik.errors.peso)}
                helperText={formik.touched.peso && formik.errors.peso}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id='price'
                label='Price*'
                name='price'
                type='number'
                variant='outlined'
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id='unitPrice'
                label='Price unit(Kg)'
                name='unitPrice'
                variant='outlined'
                type='number'
                value={formik.values.unitPrice}
                onChange={formik.handleChange}
                error={
                  formik.touched.unitPrice && Boolean(formik.errors.unitPrice)
                }
                helperText={formik.touched.unitPrice && formik.errors.unitPrice}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id='address'
                label='Address'
                name='address'
                variant='outlined'
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button type='submit' disabled={loading}>
                {loading || loading2 ? (
                  <Box display='flex'>
                    <CircularProgress color='success' size={35} />
                  </Box>
                ) : (
                  "Save"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
      <Alert
        open={alertState.open}
        message={alertState.message}
        severty={alertState.severty}
        onClose={handleCloseAlert}
      />
    </>
  );
}

export default FormAddReceipt;
