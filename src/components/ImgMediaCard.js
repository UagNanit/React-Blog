import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

const useStyles = makeStyles({
  root: {
    maxWidth: 450
  }
});

export default function ImgMediaCard(props) {
  const classes = useStyles();
  let history = useHistory();

  const handleArtticle = () => {
    history.push(`/article/${props.index}`);
  };

  const [textCard, setTextCard] = React.useState(
    props.autor
      ? props.autor
      : "Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica"
  );

  const [themeCard, setThemeCard] = React.useState(
    props.theme ? props.theme : "Lizard"
  );

  const [imgUrlCard, setImgUrlCard] = React.useState(
    props.imgUrl
      ? props.imgUrl
      : "https://material-ui.com/static/images/cards/contemplative-reptile.jpg"
  );

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height="200"
          image={imgUrlCard}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {themeCard}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {textCard}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Tooltip title="Not work">
          <Button size="small" color="primary">
            Share
          </Button>
        </Tooltip>

        <Button onClick={handleArtticle} size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}
