import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import MainPage from "./components/UI/mainPage/mainPage.js";
import Auth from "./containers/Auth/Auth";
import Categories from "./containers/Categories/Categories";
import AddTest from "./containers/AddTest/AddTest";
import RemoveTest from "./containers/RemoveTest/RemoveTest";
import path from "path";
import "./App.css";
class App extends Component {
  componentDidMount() {
    // localStorage.setItem("Auth", 1);
    localStorage.removeItem("Auth");
    console.log(process.cwd());
  }
  render() {
    return (
      <div className="Main">
        <div onClick={() => this.props.history.push("/")} className="BackDiv">
          <p>&larr;</p>
        </div>
        <Switch>
          <Route
            path="/windows"
            component={() => <Categories cat="windows" />}
          />
          <Route path="/linux" component={() => <Categories cat="linux" />} />
          <Route path="/admin/dodajtest" component={AddTest} />
          <Route path="/admin/usuntest" component={RemoveTest} />
          <Route path="/admin" component={Auth} /> }
          <Route path="/" component={MainPage} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
