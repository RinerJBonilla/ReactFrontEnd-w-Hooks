import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

import { Form } from "semantic-ui-react";

import Axios from "axios";
import {
  Transition,
  TransitionGroup,
  CSSTransition
} from "react-transition-group";
import { play, exit } from "../timelines";
import "./Dialog.css";

class Register extends React.Component {
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
      const { data } = await Axios.post(
        process.env.REACT_APP_API_ADDRESS + "/register",
        {
          username,
          password
        }
      );
      console.log(data);

      console.log("you've signed up. yay!");
      history.push("/login");
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
      <TransitionGroup component={null}>
        <Transition
          appear={true}
          onEnter={(node, appears) => play("pathname", node, appears)}
          onExit={(node, appears) => exit(node, appears)}
          timeout={{ enter: 750, exit: 150 }}
        >
          <div data-testid="register-container">
            <div className="container">
              <div className="d-flex justify-content-center">
                <h1>Sign Up</h1>
              </div>
            </div>

            <div className="d-flex justify-content-center">
              <form
                data-testid="register-form"
                className="border"
                style={mstyle}
                error={error ? 1 : 0}
                onSubmit={this.onSubmit}
              >
                <Form.Input
                  inline
                  label="Username"
                  name="username"
                  placeholder="username"
                  onChange={this.handleChange}
                />
                <Form.Input
                  inline
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="password"
                  onChange={this.handleChange}
                />
                <button
                  data-testid="register-button"
                  className="btn btn-outline-secondary"
                  style={{ margin: "10px" }}
                  type="submit"
                >
                  Sign Up!
                </button>
              </form>
            </div>
            <div className="container">
              <div className="d-flex justify-content-center">
                <small>
                  Have an Account?
                  <Link to={"/login"} className="nav-link">
                    Log In!
                  </Link>
                </small>
              </div>
            </div>

            <div className="container mb-3">
              <div className="d-flex justify-content-center mb-3">
                <TransitionGroup component={null}>
                  {error && (
                    <CSSTransition classNames="dialog" timeout={300}>
                      <div
                        className="alert alert-danger text-center"
                        role="alert"
                      >
                        {this.state.message}
                      </div>
                    </CSSTransition>
                  )}
                </TransitionGroup>
              </div>
            </div>
          </div>
        </Transition>
      </TransitionGroup>
    );
  }
}
export default Register;
