import { useReducer } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import clsx from "clsx";
import { Box, Button, Grid, Typography } from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Modal from "../Modals/modal";
import FormAddReceipt from "../Forms/formAddReceipt";
import { useAuth, IAuth } from "../../Context/authContext";
import FormSingIn from "../Forms/formSingIn";
import { useSelector } from "react-redux";
import { IInitialState } from "../../Redux/store";
import { useMutation, gql } from "@apollo/client";
import {
  IDataReciept,
  IResponse,
} from "../../InterfaceGlobals/globalsInterface";
import Alert, { IAlert } from "../Alert/alert";
import _ from "lodash";

const REMOVE_RECEIPT = gql`
  mutation RemoveReceipt($input: RemoveReceiptInput!) {
    removeReceipt(input: $input) {
      status
      message
    }
  }
`;

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      padding: "22px 55px 22px 55px",
      bottom: 0,
      backgroundColor: "#0C4D27",
    },
    button: {
      color: "white",
      marginRight: "35px",
    },
    fixed: {
      position: "fixed",
    },
  })
);

const initialStateModal = {
  title: "",
  content: <></>,
  open: false,
};

type ActionType = {
  type: "OPEN_MODAL_CLOSE_MODAL";
  payload: { title: string; content: JSX.Element; open: boolean };
};

const reducerModal = (state: typeof initialStateModal, action: ActionType) => {
  if (action.type === "OPEN_MODAL_CLOSE_MODAL") {
    return {
      ...state,
      content: action.payload.content,
      open: action.payload.open,
      title: action.payload.title,
    };
  }
  return state;
};

interface IRemoveReceiptInput {
  idPublic: string;
}

const initialStateAlert: IAlert = {
  open: false,
  message: "",
  severty: undefined,
};

type IActionType = {
  type: "CHANGE_ALERT";
  payload: IAlert;
};

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
function Footer() {
  const classes = useStyles();
  const selectReceipt = useSelector((state: IInitialState) => state.receipt);
  const auth: IAuth | null = useAuth();
  const [alertState, dispatchAlert] = useReducer(
    reducerAlert,
    initialStateAlert
  );
  const [modalInfo, dispatchModal] = useReducer(
    reducerModal,
    initialStateModal
  );
  const [receiptRemove, { loading, reset }] = useMutation<
    { removeReceipt: IResponse },
    { input: IRemoveReceiptInput }
  >(REMOVE_RECEIPT);

  const handleCloseModal = () => {
    dispatchModal({
      type: "OPEN_MODAL_CLOSE_MODAL",
      payload: {
        title: "",
        content: <></>,
        open: false,
      },
    });
  };

  const handleCloseAlert = () => {
    dispatchAlert({
      type: "CHANGE_ALERT",
      payload: { open: false, message: "", severty: undefined },
    });
  };

  const handleOpenModal = () => {
    if (auth?.authState.isAuth) {
      dispatchModal({
        type: "OPEN_MODAL_CLOSE_MODAL",
        payload: {
          title: "Add new receipt",
          content: <FormAddReceipt close={handleCloseModal} onEdit={false} />,
          open: true,
        },
      });
    } else {
      dispatchModal({
        type: "OPEN_MODAL_CLOSE_MODAL",
        payload: {
          title: "You must login to add a receipt",
          content: <FormSingIn closeModal={handleCloseModal} />,
          open: true,
        },
      });
    }
  };

  const handleEditReceipt = (values: IDataReciept) => {
    if (auth?.authState.isAuth && selectReceipt.idPublic) {
      dispatchModal({
        type: "OPEN_MODAL_CLOSE_MODAL",
        payload: {
          title: "You are editing a receipt",
          content: (
            <FormAddReceipt
              onEdit={true}
              valuesForm={values}
              close={handleCloseModal}
            />
          ),
          open: true,
        },
      });
    } else {
      dispatchModal({
        type: "OPEN_MODAL_CLOSE_MODAL",
        payload: {
          title: "Restricted",
          content: <Typography>You must login to remove a receipt</Typography>,
          open: true,
        },
      });
    }
  };

  const handleRemoveReceipt = () => {
    if (auth?.authState.isAuth && selectReceipt.idPublic) {
      const input: IRemoveReceiptInput = { idPublic: selectReceipt.idPublic };
      receiptRemove({ variables: { input: input } })
        .then((response) => {
          if (response.data?.removeReceipt.status) {
            dispatchAlert({
              type: "CHANGE_ALERT",
              payload: {
                open: true,
                message: "It was deleted correctly",
                severty: "success",
              },
            });
            reset();
          } else {
            dispatchAlert({
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
          dispatchAlert({
            type: "CHANGE_ALERT",
            payload: {
              open: true,
              message: err.message,
              severty: "error",
            },
          });
          reset();
        });
    } else {
      dispatchModal({
        type: "OPEN_MODAL_CLOSE_MODAL",
        payload: {
          title: "Restricted",
          content: <Typography>You must login to remove a receipt</Typography>,
          open: true,
        },
      });
    }
  };

  return (
    <>
      <Grid
        container
        direction='row'
        className={clsx(classes.root, classes.fixed)}
        alignItems='flex-end'>
        <Grid item xs={12} md={7}>
          <Box display='flex' flexDirection={"row"}>
            <Button
              variant='outlined'
              className={classes.button}
              size='small'
              onClick={() => handleEditReceipt(selectReceipt)}
              disabled={
                loading || _.isEmpty(selectReceipt.idPublic) ? true : false
              }>
              Edit
            </Button>
            <Button
              variant='outlined'
              className={classes.button}
              size='small'
              onClick={handleRemoveReceipt}
              disabled={
                loading || _.isEmpty(selectReceipt.idPublic) ? true : false
              }>
              Remove
            </Button>
            <Button
              variant='outlined'
              className={classes.button}
              endIcon={<AddCircleOutlineOutlinedIcon />}
              onClick={() => handleOpenModal()}>
              Add Receipt
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Modal
        title={modalInfo.title}
        content={modalInfo.content}
        open={modalInfo.open}
        close={handleCloseModal}
      />
      <Alert
        message={alertState.message}
        open={alertState.open}
        severty={alertState.severty}
        onClose={handleCloseAlert}
      />
    </>
  );
}
export default Footer;
