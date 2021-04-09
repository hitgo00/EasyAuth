import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import GetAppIcon from "@material-ui/icons/GetApp";
import moment from "moment";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function EventCard({ event, onDownloadClick }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {event.event_name[0]}
          </Avatar>
        }
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title={event.event_name}
        subheader={moment(event.created_at).format("lll")}
      />
      <CardContent>
        {/* <Typography variant="body2" color="textSecondary" component="p">
          Will add event description here!
        </Typography> */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={() => onDownloadClick(event._id)}
            style={{ marginRight: "1rem" }}
            variant="outlined"
          >
            <GetAppIcon />
          </Button>
          <Typography variant="body1">
            Download registered users data
          </Typography>
        </div>
      </CardContent>
      <CardActions disableSpacing>
        {
          expanded ? (
            <Typography noWrap color="secondary">
              <code>{event.token}</code>
            </Typography>
          ) : null
          // <IconButton aria-label="add to favorites">
          //   <FavoriteIcon />
          // </IconButton>
        }
        <IconButton
          onClick={() => {
            navigator.clipboard.writeText(event.token);
          }}
        >
          <FileCopyIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show token"
        >
          {expanded ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
      </CardActions>
      {/* <Collapse in={expanded} timeout="auto" unmountOnExit></Collapse> */}
    </Card>
  );
}
