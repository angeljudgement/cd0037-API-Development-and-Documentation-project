import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./stylesheets/App.css";
import FormView from "./components/FormView";
import QuestionView from "./components/QuestionView";
import Header from "./components/Header";
import QuizView from "./components/QuizView";
import Login from "./components/Login";
import AuthService from "./service/auth.service";

class App extends Component {
  auth = AuthService;

  constructor() {
    super();
    this.auth.load_jwts();
    this.auth.check_token_fragment();
    if (
      !AuthService.activeJWT() &&
      !document.location.href.includes("/login")
    ) {
      document.location.href = "/login";
    }
  }
  render() {
    return (
      <div className="App">
        <Header path />
        <Router>
          <Switch>
            <Route path="/" exact component={QuestionView} />
            <Route path="/add" component={FormView} />
            <Route path="/edit/:id" component={FormView} />
            <Route path="/play" component={QuizView} />
            <Route path="/login" component={Login} />
            <Route component={QuestionView} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
