import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useHistory } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { UserContext } from "./context";
import ArticleList from "./ArticleList";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AlternateEmailSharpIcon from "@mui/icons-material/AlternateEmailSharp";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import AlertTitle from "@mui/material/AlertTitle";

import {
  getAuth,
  signInWithEmailAndPassword,
  //signInWithPopup,
  //GoogleAuthProvider,
  //signInWithRedirect,
  signOut
} from "firebase/auth";

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func
};

export default function ScrollBoxForList(props) {
  const [values, setValues] = React.useState({
    email: "",
    password: "",
    showPassword: false
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [openLogin, setOpenLogin] = useState(false);

  const handleClose = () => {
    setOpenLogin(false);
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in
        setUserCon(userCredential.user);
        setValues({
          ...values,
          password: ""
        });
        setOpenLogin(false);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        setOpenErr(true);
      });
  };

  const auth = getAuth();

  const logout = () => {
    signOut(auth)
      .then((result) => {
        console.log("signOut:" + result);
        setUserCon(null);
        // Sign-out successful.
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  const { userCon, setUserCon } = useContext(UserContext);

  let history = useHistory();

  const handleAddEditForm = () => {
    history.push(`/addEditForm/${-1}`);
  };

  const [openErr, setOpenErr] = React.useState(false);

  return (
    <React.Fragment>
      <CssBaseline />
      <ElevationScroll {...props}>
        <AppBar>
          <Toolbar
            style={{ backgroundColor: "#171717", color: "#EDEDED" }}
            variant="regular"
          >
            <Typography width="100%" variant="h6" component="div">
              Nanit Blog
            </Typography>

            {userCon ? (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Tooltip title="Add article">
                  <Fab
                    onClick={handleAddEditForm}
                    size="medium"
                    color="secondary"
                    aria-label="add"
                    variant="circular"
                  >
                    <AddIcon />
                  </Fab>
                </Tooltip>
                <Tooltip title={"Sign Out " + userCon.displayName ?? ""}>
                  <Button onClick={logout} color="inherit">
                    Logout
                  </Button>
                </Tooltip>
              </div>
            ) : (
              <Tooltip title="Sign In">
                <Button
                  onClick={() => {
                    setOpenLogin(true);
                  }}
                  color="inherit"
                >
                  Login
                </Button>
              </Tooltip>
            )}
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar />
      <Container>
        <Box sx={{ my: 2 }}>
          <ArticleList />

          <Dialog open={openLogin} onClose={handleClose}>
            <Collapse in={openErr}>
              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpenErr(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 0, fontWeight: "bold" }}
              >
                <AlertTitle>Error</AlertTitle>
                Incorrect Email or Password!
              </Alert>
            </Collapse>
            <DialogTitle>Sign In</DialogTitle>
            <DialogContent>
              <DialogContentText style={{ fontWeight: "bold" }}>
                Enter email address and password
              </DialogContentText>
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                <div>
                  <TextField
                    label="Email"
                    id="outlined-start-adornment"
                    sx={{ m: 1, width: "25ch" }}
                    value={values.mail}
                    onChange={handleChange("email")}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {" "}
                          <AlternateEmailSharpIcon />
                        </InputAdornment>
                      )
                    }}
                  />

                  <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={values.showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={handleChange("password")}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {values.showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                </div>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleLogin}>Login</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </React.Fragment>
  );
}
