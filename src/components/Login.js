import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "store";
import Cookie from "js-cookie";
import { Link } from "react-router-dom";

import { Form } from "semantic-ui-react";

import Axios from "axios";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      error: false,
      message: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit(e) {
    e.preventDefault();

    const { username, password } = this.state;
    const { history } = this.props;

    this.setState({ error: false });

    //login
    try {
      const { data } = await Axios.post("http://10.102.1.119:3001/login", {
        username,
        password
      });
      console.log(data);

      Cookie.set("token", data.token);

      console.log("you're logged in. yay!");
      store.set("loggedIn", true);
      history.push("/home");
    } catch (error) {
      console.log(error.response);
      return this.setState({
        error: true,
        message: error.response.data.error || error.response.data.message
      });
    }
  }

  handleChange(e, { name, value }) {
    this.setState({ [name]: value });
  }
  render() {
    const { error } = this.state;
    const mstyle = {
      borderRadius: "5px",
      padding: "20px",
      backgroundColor: "#f2f2f2"
    };

    return (
      <div>
        <div className="container">
          <div className="d-flex justify-content-center">
            <h1>Log In</h1>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <form
            className="border"
            style={mstyle}
            error={error ? 1 : 0}
            onSubmit={this.onSubmit}
          >
            <Form.Input
              inline
              label="Username"
              name="username"
              onChange={this.handleChange}
            />
            <Form.Input
              inline
              label="Password"
              type="password"
              name="password"
              onChange={this.handleChange}
            />
            <button
              className="btn btn-outline-secondary"
              style={{ margin: "10px" }}
              type="submit"
            >
              Log In!
            </button>
          </form>
        </div>
        <div className="container">
          <div className="d-flex justify-content-center">
            <small>
              Not registered?
              <Link to={"/register"} className="nav-link">
                Sign Up!
              </Link>
            </small>
          </div>
        </div>

        <div className="container mb-3">
          <div className="d-flex justify-content-center mb-3">
            {error && (
              <div className="alert alert-danger text-center" role="alert">
                {this.state.message}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default Login;
