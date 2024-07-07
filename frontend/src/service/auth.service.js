import { environment } from "../env";
import { jwtDecode } from "jwt-decode";

const JWTS_LOCAL_KEY = "JWTS_LOCAL_KEY";
// const JWTS_ACTIVE_INDEX_KEY = "JWTS_ACTIVE_INDEX_KEY";

class AuthBaseService {
  url = environment.auth0.url;
  audience = environment.auth0.audience;
  clientId = environment.auth0.clientId;
  callbackURL = environment.auth0.callbackURL;

  token;
  payload;

  build_login_link(callbackPath = "") {
    let link = "https://";
    link += this.url + ".auth0.com";
    link += "/authorize?";
    link += "audience=" + this.audience + "&";
    link += "response_type=token&";
    link += "client_id=" + this.clientId + "&";
    link += "redirect_uri=" + this.callbackURL + callbackPath;
    return link;
  }

  build_logout_link(callbackPath = "") {
    let link = "https://";
    link += this.url + ".auth0.com";
    link += "/oidc/logout?";
    link += "client_id=" + this.clientId + "&";
    link += "post_logout_redirect_uri=" + this.callbackURL + callbackPath;
    return link;
  }

  // invoked in app.component on load
  check_token_fragment() {
    // parse the fragment
    const fragment = window.location.hash.substr(1).split("&")[0].split("=");
    // check if the fragment includes the access token
    if (fragment[0] === "access_token") {
      // add the access token to the jwt
      this.token = fragment[1];
      // save jwts to localstore
      this.set_jwt();
    }
  }

  set_jwt() {
    localStorage.setItem(JWTS_LOCAL_KEY, this.token || "");
    if (this.token) {
      this.decodeJWT(this.token);
    }
  }

  load_jwts() {
    this.token = localStorage.getItem(JWTS_LOCAL_KEY);
    if (this.token) {
      this.decodeJWT(this.token);
    }
  }

  activeJWT() {
    return this.token;
  }

  decodeJWT(token) {
    this.payload = jwtDecode(token);
    return this.payload;
  }

  logout() {
    this.token = "";
    this.payload = null;
    this.set_jwt();
  }

  can(permission) {
    return (
      this.payload &&
      this.payload.permissions &&
      this.payload.permissions.length &&
      this.payload.permissions.indexOf(permission) >= 0
    );
  }
}

const AuthService = new AuthBaseService();

export default AuthService;
