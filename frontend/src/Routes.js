import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NewImage from "./containers/NewImage";
import Images from "./containers/Images";
import Cart from "./containers/Cart";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/login">
        <Login />
    </Route>
    <Route exact path="/signup">
      <Signup />
    </Route>
    <Route exact path="/images/new">
      <NewImage />
    </Route>
    <Route exact path="/images/:id">
      <Images />
    </Route>
    <Route exact path="/cart">
      <Cart />
    </Route>
      {/* Finally, catch all unmatched routes */}
    <Route>
        <NotFound />
    </Route>
    </Switch>
  );
}