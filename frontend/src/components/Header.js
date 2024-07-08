import React, { Component } from "react";
import "../stylesheets/Header.css";
import AuthService from "../service/auth.service";
import { permission } from "../service/permission";

class Header extends Component {
  auth = AuthService;

  constructor() {
    super();
    this.loginURL = this.auth.build_login_link("/");
    this.state = {
      isLogin: !!this.auth.token,
    };

    this.decode = AuthService.activeJWT()
      ? AuthService.decodeJWT(AuthService.activeJWT())
      : { permissions: [] };
  }

  navTo(uri) {
    window.location.href = window.location.origin + uri;
  }

  render() {
    return (
      <div className="App-header">
        <h1
          onClick={() => {
            this.navTo("");
          }}
        >
          Udacitrivia
        </h1>
        <h2
          onClick={() => {
            this.navTo("");
          }}
        >
          List
        </h2>
        {this.decode.permissions.includes(permission.post) && (
          <h2
            onClick={() => {
              this.navTo("/add");
            }}
          >
            Add
          </h2>
        )}
        {this.decode.permissions.includes(permission.get) && (
          <h2
            onClick={() => {
              this.navTo("/play");
            }}
          >
            Play
          </h2>
        )}
        {this.auth.token ? (
          <h2
            onClick={() => {
              this.auth.logout();
              window.location.href = this.auth.build_logout_link("/");
            }}
            style={{ justifySelf: "flex-end" }}
          >
            Logout
          </h2>
        ) : (
          <h2
            onClick={() => {
              window.location.href = this.auth.build_login_link("/");
            }}
            style={{ justifySelf: "flex-end" }}
          >
            Login
          </h2>
        )}
      </div>
    );
  }
}

export default Header;
