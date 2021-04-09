import React, { useEffect, useState } from "react";
import { Grid, CssBaseline } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EventCard from "../Components/EventCard";
import GetEvents from "../APIs/GetEvents";
import GetUserData from "../APIs/GetUserData";

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

  eventcard: {
    margin: theme.spacing(1),
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
function Events(props) {
  useEffect(() => {
    const fetch = async function () {
      GetEvents(localStorage.getItem("auth_token"))
        .then(({ data }) => {
          setEventList(data.objects);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetch();
  }, []);

  const classes = useStyles();
  const [eventList, setEventList] = useState([]);

  const downloadEventData = (eventId) => {
    GetUserData(localStorage.getItem("auth_token"), eventId);
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
        {eventList.map((eve, index) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <div className={classes.eventcard}>
                <EventCard onDownloadClick={downloadEventData} event={eve} />
              </div>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}

export default Events;
