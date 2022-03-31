import React, { Component, Fragment } from "react";
import { ipcRenderer } from "electron";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import Spinner from "../../components/UI/Spinner/Spinner";
import "./Auth.css";

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: "",
      password: "",
      auth: false,
      loading: false,
      err: null,
    };
  }
  componentDidMount() {
    if (localStorage.getItem("Auth") == 1) {
      this.setState({ auth: true });
    } else if (!localStorage.getItem("Auth")) {
      ipcRenderer.on("repLogin", (event, arg) => {
        localStorage.setItem("Auth", arg.auth);
        this.setState({ auth: arg.auth, loading: false, err: arg.err });
      });
    }
  }
  componentWillUnmount() {
    ipcRenderer.removeAllListeners("repLogin");
  }
  render() {
    const onSubmitHandler = (e) => {
      e.preventDefault();
      const loginAndPassword = {
        login: this.state.login,
        password: this.state.password,
      };
      ipcRenderer.send("tryLogin", loginAndPassword);
      this.setState({ loading: true });
    };
    const onTypeChange = (event, type) => {
      const value = event.target.value;
      if (type === 0) {
        this.setState({ login: value });
        return;
      }
      this.setState({ password: value });
    };
    const auth = localStorage.getItem("Auth");
    let form = (
      <form>
        <h1>Logowanie</h1>
        <label>Login</label>
        <input
          type="text"
          onChange={(event) => onTypeChange(event, 0)}
          value={this.state.login}
        />
        <label>Hasło</label>
        <input
          type="password"
          onChange={(event) => onTypeChange(event, 1)}
          value={this.state.password}
        />
        <button className="authSubmit" type="submit" onClick={onSubmitHandler}>
          Zaloguj
        </button>
      </form>
    );
    if (auth == 1 && this.state.auth) {
      form = (
        <Fragment>
          <Link
            className="navigationButton"
            to={this.props.location.pathname + "/dodajtest"}
          >
            Dodaj test
          </Link>
          <Link
            className="navigationButton"
            to={this.props.location.pathname + "/usuntest"}
          >
            Usuń test
          </Link>
        </Fragment>
      );
    }
    return (
      <div className={auth ? "mainAuth auth" : "mainAuth"}>
        {this.state.loading ? <Spinner /> : form}
        {this.state.err ? <div className="Error">{this.state.err}</div> : null}
      </div>
    );
  }
}

export default withRouter(Auth);
