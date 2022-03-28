import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Modal from "../Modals/modal";
import FormLogIn from "../Forms/formSingIn";
import FormSingUp from "../Forms/formSingUp";
import { useAuth, IAuth } from "../../Context/authContext";
import { useSelector } from "react-redux";
import { IInitialState } from "../../Redux/store";
import moment from "moment";

function NavBar() {
  const auth: IAuth | null = useAuth();
  const selectReceipt = useSelector((state: IInitialState) => state.receipt);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const [openModalLogIn, setOpenModalLogIn] = useState<boolean>(false);
  const [openModalSingUp, setOpenModalSingUp] = useState<boolean>(false);
  const [diffDays, setDiffDays] = useState<string>("#000");

  const handleCloseModalLogIn = () => {
    setOpenModalLogIn(false);
  };

  const handleCloseModalSingUp = () => {
    setOpenModalSingUp(false);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  useEffect(() => {
    if (selectReceipt) {
      if (moment(selectReceipt?.createDate).diff(moment(), "days") * -1 < 3) {
        setDiffDays("#00ff00");
      } else if (
        moment(selectReceipt?.createDate).diff(moment(), "days") * -1 < 5 &&
        moment(selectReceipt?.createDate).diff(moment(), "days") * -1 >= 3
      ) {
        setDiffDays("#ffff00");
      } else if (
        moment(selectReceipt?.createDate).diff(moment(), "days") * -1 >=
        5
      ) {
        setDiffDays("#FF0000");
      }
    }
  }, [selectReceipt]);

  return (
    <>
      <AppBar position='relative' sx={{ backgroundColor: "#0C4D27" }}>
        <Container maxWidth='xl'>
          <Toolbar>
            <Box
              display={"flex"}
              sx={{ flexGrow: 0.1 }}
              justifyContent='space-around'>
              <Typography>
                Receipt Number - {selectReceipt.consecutive}
              </Typography>
              <Typography>Status</Typography>
              <Box
                sx={{
                  border: "solid 1px black",
                  width: "20px",
                  height: "20px",
                  backgroundColor: diffDays,
                }}
              />
              <Typography>
                de 1 a 2 dias verde --- de 3 a 4 dias amarillo --- 5 o mas dias
                rojo
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} display='flex' justifyContent='end'>
              {auth?.authState.isAuth ? (
                <>
                  <Tooltip title='Open settings'>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar>{auth.authState.user.username[0]}</Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id='menu-appbar'
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}>
                    <MenuItem onClick={() => auth?.singOut()}>
                      <Typography textAlign='center'>Log Out</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Tooltip title='Log In'>
                    <Button
                      sx={{ color: "white" }}
                      onClick={() => setOpenModalLogIn(true)}>
                      Log In
                    </Button>
                  </Tooltip>
                  <Tooltip title='Sing Up'>
                    <Button
                      sx={{ color: "white" }}
                      onClick={() => setOpenModalSingUp(true)}>
                      Sing Up
                    </Button>
                  </Tooltip>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Modal
        close={handleCloseModalLogIn}
        title={"Log In"}
        content={<FormLogIn closeModal={handleCloseModalLogIn} />}
        open={openModalLogIn}
      />
      <Modal
        close={handleCloseModalSingUp}
        title={"Sing Up"}
        content={<FormSingUp />}
        open={openModalSingUp}
      />
    </>
  );
}
export default NavBar;
