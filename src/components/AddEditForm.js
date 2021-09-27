import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { styled } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import AlertTitle from "@mui/material/AlertTitle";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { UserContext } from "./context";
import { app, db } from "./base";
import {
  //getFirestore,
  collection,
  addDoc,
  //getDocs,
  //firestore
  setDoc,
  //updateDoc,
  //deleteDoc,
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

const Input = styled("input")({
  display: "none"
});

export default function AddEditForm(props) {
  const { userCon, setUserCon } = React.useContext(UserContext);

  const [index, setIndex] = React.useState(() => {
    return props.match.params.id;
  });

  const [data, setData] = React.useState({
    img: "",
    title: "",
    autor: "",
    text: ""
  });

  const [loadingData, setloadingData] = React.useState(true);

  React.useEffect(async () => {
    if (props.match.params.id == -1) {
      console.log(props.match.params.id);
      return;
    }
    const docRef = doc(db, "articles", props.match.params.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setData(docSnap.data());
      setloadingData(false);
    } else {
      console.log("No such document!");
    }
  }, []);

  const [valueTitle, setValueTitle] = React.useState("");
  const [valueAuthor, setValueAutor] = React.useState("");
  const [valueText, setValueText] = React.useState("");
  const [valueImg, setValueImg] = React.useState("");

  const handleChangeTitle = (event) => {
    setValueTitle(event.target.value);
    setData({
      ...data,
      title: event.target.value
    });
  };
  const handleChangeAutor = (event) => {
    setValueAutor(event.target.value);
    setData({
      ...data,
      autor: event.target.value
    });
  };
  const handleChangeText = (event) => {
    setValueText(event.target.value);
    setData({
      ...data,
      text: event.target.value
    });
  };
  const handleChangeImg = (event) => {
    setValueImg(event.target.value);
    setData({
      ...data,
      img: event.target.value
    });
  };

  const [open, setOpen] = React.useState(false);
  const [openErr, setOpenErr] = React.useState(false);

  const handleClickOpen = () => {
    if (
      (valueText !== "" &&
        valueTitle !== "" &&
        valueAuthor !== "" &&
        valueImg !== "") ||
      (data?.text !== "" &&
        data?.title !== "" &&
        data?.autor !== "" &&
        data?.img !== "")
    ) {
      setOpen(true);
    } else {
      setOpenErr(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (index != -1) {
      //перезапись
      await setDoc(doc(db, "articles", index), {
        img: data.img,
        title: data.title,
        autor: data.autor,
        text: data.text
      });

      setOpen(false);
      history.push(`/article/${index}`);
    } else {
      //добавление
      const docRef = await addDoc(collection(db, "articles"), {
        img: data.img,
        title: data.title,
        autor: data.autor,
        text: data.text
      });
      console.log("Document written with ID: ", docRef.id);
      setOpen(false);
      history.push(`/article/${docRef.id}`);
    }
  };

  let history = useHistory();
  const handleCancel = () => {
    if (index == -1) {
      history.push(`/`);
    } else {
      history.push(`/article/${index}`);
    }
  };

  if (userCon === null) {
    history.push(`/`);
  }
  if (loadingData && props.match.params.id != -1) {
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
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "80%" }
      }}
      noValidate
      autoComplete="off"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "25px"
        }}
      >
        <Stack style={{ marginBottom: "20px" }} direction="row" spacing={2}>
          <Button
            disabled={openErr}
            style={{ width: "100px" }}
            variant="contained"
            color="success"
            onClick={handleClickOpen}
          >
            Save
          </Button>
          <Button
            onClick={handleCancel}
            style={{ width: "100px" }}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
        </Stack>
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
            sx={{ mb: 0 }}
          >
            <AlertTitle>Error</AlertTitle>
            Fill in all the fields!
          </Alert>
        </Collapse>

        <CardMedia
          component="img"
          alt="Image"
          height="140"
          image={data.img}
          title="Contemplative Reptile"
        />
        <label htmlFor="icon-button-file">
          <Input accept="image/*" id="icon-button-file" type="file" />
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <PhotoCamera />
          </IconButton>
        </label>
        <TextField
          id="outlined-multiline-flexible-ImageUrl"
          label="Image Url"
          multiline
          maxRows={3}
          value={data.img.toString()}
          onChange={handleChangeImg}
          name="ImageUrl"
        />
        <TextField
          id="outlined-multiline-flexible-ImageTitle"
          label="Title"
          multiline
          maxRows={3}
          value={data.title.toString()}
          onChange={handleChangeTitle}
          name="ImageTitle"
        />
        <TextField
          id="outlined-multiline-flexible-Author"
          label="Author"
          multiline
          maxRows={3}
          value={data.autor.toString()}
          onChange={handleChangeAutor}
          name="Author"
        />
        <TextField
          id="outlined-multiline-static-Text"
          label="
          Article text"
          multiline
          rows={20}
          value={data.text.toString()}
          onChange={handleChangeText}
          name="Text"
        />
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Attention
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Save article?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            No
          </Button>
          <Button onClick={handleSave}>Yes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
