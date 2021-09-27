import * as React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import ImgMediaCard from "./ImgMediaCard";
import { app, db } from "./base";
import {
  //getFirestore,
  collection,
  //addDoc,
  getDocs
  //firestore
  //setDoc
  //doc,
  //getDoc
} from "firebase/firestore";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: "center",
  color: theme.palette.text.secondary
}));
//props.match.params.id
export default function ArticleList(props) {
  const [data, setData] = React.useState([]);
  const [loadingData, setloadingData] = React.useState(true);

  React.useEffect(async () => {
    const dataFromDb = [];
    const querySnapshot = await getDocs(collection(db, "articles"));
    querySnapshot.forEach((doc) => {
      //console.log(doc.id);
      dataFromDb.push({ ...doc.data(), key: doc.id });
      //console.log({ ...doc.data(), key: doc.id });
    });
    setData(dataFromDb);
    setloadingData(false);
    localStorage.setItem("data", dataFromDb);
    return () => querySnapshot();
  }, [loadingData]);

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
    <div>
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
      >
        {data.length > 0 ? (
          data.map((item) => (
            <Item key={item.key}>
              <ImgMediaCard
                autor={item.autor}
                theme={item.title}
                imgUrl={item.img}
                index={item.key}
              />
            </Item>
          ))
        ) : (
          <h1>No data...</h1>
        )}
      </Stack>
    </div>
  );
}
