import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Zoom from "@mui/material/Zoom";
import BackspaceIcon from "@mui/icons-material/Backspace";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CardMedia from "@material-ui/core/CardMedia";
import { useHistory } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import TextField from "@mui/material/TextField";
import Collapse from "@mui/material/Collapse";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { UserContext } from "./context";
import { app, db } from "./base";
import {
  //getFirestore,
  //collection,
  //addDoc,
  //getDocs,
  //firestore
  //setDoc
  //updateDoc,
  deleteDoc,
  doc,
  getDoc
} from "firebase/firestore";
import { async } from "@firebase/util";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

function ScrollTop(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func
};
//------------------------------------------------

export default function ArticleItem(props) {
  const { userCon, setUserCon } = useContext(UserContext);

  const [data, setData] = useState({});

  const [loadingData, setloadingData] = React.useState(true);

  const docRef = doc(db, "articles", props.match.params.id);

  React.useEffect(async () => {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //console.log("Document data:", docSnap.data());
      setData(docSnap.data());
      setloadingData(false);
    } else {
      console.log("No such document!");
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  let history = useHistory();

  const handleBack = () => {
    history.push("/");
  };

  const [open, setOpen] = useState(false);

  const handleClickOpenModalDel = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    handleDelArticle();
  };

  const handleCloseCancel = () => {
    setOpen(false);
  };

  const handleDelArticle = async () => {
    //del func!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    await deleteDoc(docRef);
    history.push("/");
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleAddEditForm = () => {
    history.push(`/addEditForm/${props.match.params.id}`);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleAddEditForm}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <EditIcon />
        </IconButton>
        <p>Edit</p>
      </MenuItem>
      <MenuItem onClick={handleClickOpenModalDel}>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <DeleteForeverIcon />
        </IconButton>
        <p>Delete</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  if (loadingData) {
    return (
      <div>
        <h1>Loading firebase data...</h1>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Tooltip title="Back" arrow>
            <Button onClick={handleBack} color="inherit">
              <BackspaceIcon />
            </Button>
          </Tooltip>

          <Typography variant="h6" component="div">
            {data !== null ? data.title : "No theme"}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Collapse in={userCon !== null ? true : false}>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Tooltip title="Edit" arrow>
                <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                  onClick={handleAddEditForm}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete" arrow>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                  onClick={handleClickOpenModalDel}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>

              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Collapse>
        </Toolbar>
        {renderMobileMenu}
        {renderMenu}
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <Container>
        <div style={{ textAlign: "left", paddingInline: "50px" }}>
          <Box sx={{ my: 2 }}>
            <CardMedia
              component="img"
              alt="Contemplative Reptile"
              height="140"
              image={
                data !== null
                  ? data.img
                  : "https://material-ui.com/static/images/cards/contemplative-reptile.jpg"
              }
              title="Contemplative Reptile"
            />
            <TextField
              style={{ width: "100%", color: "black" }}
              onChange={(event) => {
                event.preventDefault();
              }}
              id="Text"
              //disabled
              label=""
              multiline
              value={data !== null ? data.text : "No text"}
              name="Text"
            />
          </Box>
        </div>
      </Container>
      <ScrollTop {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
      <Dialog
        open={open}
        onClose={handleCloseCancel}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Attention
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Delete article?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseCancel}>
            Cancel
          </Button>
          <Button onClick={handleClose}>Yes</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
