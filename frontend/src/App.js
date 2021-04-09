import React from "react";
import "./App.css";
import { useUserState } from "./Context/UserContext";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import MenuAppBar from "./Components/MenuAppbar";
import Admin from "./Pages/Admin";
import Login from "./Pages/Login";
import Events from "./Pages/Events";
import CircularProgress from "@material-ui/core/CircularProgress";

function App() {
  var { isAuthenticated } = useUserState();

  return (
    <BrowserRouter>
      <MenuAppBar />
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/admin" />} />
        <PrivateRoute path="/admin" component={Admin} />
        <PrivateRoute path="/events" component={Events} />
        <PublicRoute path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}

export default App;
