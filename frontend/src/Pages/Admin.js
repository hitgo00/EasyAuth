import React, { useState } from "react";
import { Grid, CssBaseline, Typography, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Dialog, TextField } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DescriptionIcon from "@material-ui/icons/Description";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import { useHistory } from "react-router-dom";

import CreateEvent from "../APIs/CreateEvent";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      padding: "4vh",
    },
    [theme.breakpoints.between("sm", "md")]: {
      padding: "8vh",
    },
    [theme.breakpoints.up("md")]: {
      padding: "8vh",
    },
  },

  paper: {
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(1),
    },
    [theme.breakpoints.up("md")]: {
      margin: theme.spacing(2),
    },

    textAlign: "center",
    padding: theme.spacing(2),
  },

  typobody: {
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    [theme.breakpoints.between("sm", "md")]: {},
    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(4),
      marginLeft: theme.spacing(8),
      marginRight: theme.spacing(8),
    },
  },
  button: {
    [theme.breakpoints.up("md")]: {
      width: theme.spacing(32),
    },
    padding: theme.spacing(2),
    marginTop: theme.spacing(4),
  },

  buttonicon: {
    marginRight: theme.spacing(1),
  },

  divider: {
    marginTop: theme.spacing(2),
  },
}));
function Admin(props) {
  const classes = useStyles();
  let history = useHistory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventName, setEventName] = useState("");

  const onDialogCreateNewEventClick = () => {
    if (eventName) {
      CreateEvent(localStorage.getItem("auth_token"), eventName)
        .then(() => {
          history.push("/events");
        })
        .catch(console.log);
    }
  };

  return (
    <>
      <Grid
        container
        className={classes.root}
        alignItems="center"
        justify="center"
      >
        <CssBaseline />
        <Grid item xs={12} sm={12} md={6}>
          <Paper className={classes.paper} elevation={2}>
            <Typography variant="h3" align="center">
              Create New Event
            </Typography>
            <Divider className={classes.divider} variant="middle" />
            <Typography
              className={classes.typobody}
              align="center"
              variant="body1"
              color="textSecondary"
            >
              Click the button below to Create New Event for your website, users
              for this event can be separately accessed by you. You can
              Implement Authentication system with our end-points with token
              provided by us, see the guide for more info.
            </Typography>
            <Fab
              onClick={() => setDialogOpen(true)}
              className={classes.button}
              variant="extended"
              size="large"
              color="primary"
              aria-label="add"
            >
              <AddCircleOutlineIcon className={classes.buttonicon} />
              Create New Event
            </Fab>
          </Paper>
          <Dialog open={dialogOpen}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "4rem",
              }}
            >
              <CloseOutlinedIcon
                onClick={() => setDialogOpen(false)}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  cursor: "pointer",
                }}
              />
              <Typography variant="h4">Create New Event</Typography>
              <TextField
                autoFocus
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                style={{ marginTop: "3rem" }}
                label="Event name"
                variant="outlined"
              />
              <Fab
                onClick={onDialogCreateNewEventClick}
                className={classes.button}
                variant="extended"
                size="medium"
                color="primary"
                aria-label="add"
                disabled={!eventName}
              >
                <AddCircleOutlineIcon className={classes.buttonicon} />
                Create New Event
              </Fab>
            </div>
          </Dialog>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Paper className={classes.paper} elevation={2}>
            <Typography variant="h3" align="center">
              Show My Events
            </Typography>
            <Divider className={classes.divider} variant="middle" />
            <Typography
              className={classes.typobody}
              align="center"
              variant="body1"
              color="textSecondary"
            >
              Click the button below to Show All events created by you, you can
              get token for created events, by which you can access our server
              to authenticate your event participants. Manage Users with
              EasyAuth Dashboard and Services.
            </Typography>
            <Fab
              className={classes.button}
              variant="extended"
              size="large"
              color="primary"
              aria-label="add"
              onClick={() => history.push("/events")}
            >
              <VisibilityIcon className={classes.buttonicon} />
              Show My Events
            </Fab>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Paper className={classes.paper} elevation={2}>
            <Typography variant="h3" align="center">
              Guide To Use EasyAuth
            </Typography>
            <Divider className={classes.divider} variant="middle" />
            <Fab
              className={classes.button}
              variant="extended"
              size="large"
              color="primary"
              aria-label="add"
            >
              <DescriptionIcon className={classes.buttonicon} />
              Documentation
            </Fab>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default Admin;
