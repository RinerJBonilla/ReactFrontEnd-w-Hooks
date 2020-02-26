import React, { Component } from "react";
import Axios from "axios";

import Cookie from "js-cookie";
import jwt from "jsonwebtoken";
import { Form } from "semantic-ui-react";

export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      username: "",
      password: "",
      confirmpassword: "",
      error: false,
      message: ""
    };
  }

  handleChange(e, { name, value }) {
    this.setState({ [name]: value });
  }

  async componentDidMount() {
    let head = {
      headers: {
        authtoken: Cookie.get("token")
      }
    };
    const idd = jwt.decode(Cookie.get("token"));

    try {
      const userdata = await Axios.get(
        "http://10.102.1.119:3001/users/" + idd.id,
        head
      );
      this.setState({
        username: userdata.data.username
      });
      console.log("finish component did mount");
    } catch (error) {
      console.log(error);
    }
  }

  async onSubmit(e) {
    e.preventDefault();

    let head = {
      headers: {
        authtoken: Cookie.get("token")
      }
    };
    const idd = jwt.decode(Cookie.get("token"));

    if (this.state.password !== this.state.confirmpassword) {
      return this.setState({
        error: true,
        message: "must confirm password"
      });
    }

    const obj = {
      username: this.state.username,
      password: this.state.password,
      confirmpassword: this.state.confirmpassword
    };
    console.log(obj);

    try {
      const data = await Axios.put(
        "http://10.102.1.119:3001/users/" + idd.id,
        obj,
        head
      );
      console.log(data.data);
      this.props.setUser(this.state.username);
      this.props.history.push("/profile");
    } catch (error) {
      return this.setState({
        error: true,
        message: error.response.data.message
          ? error.response.data.message
          : error.response.data.error
      });
    }
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
          <div className="d-flex justify-content-center" data-testid="title">
            <h1>Edit My Profile</h1>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <form
            className="border"
            style={mstyle}
            error={error ? 1 : 0}
            data-testid="edit-form"
            onSubmit={this.onSubmit}
          >
            <Form.Input
              inline
              label="Username"
              name="username"
              placeholder="username"
              value={this.state.username}
              onChange={this.handleChange}
            />
            <Form.Input
              inline
              label="Password"
              type="password"
              name="password"
              placeholder="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
            <Form.Input
              inline
              label="Confirm Password"
              type="password"
              name="confirmpassword"
              placeholder="confirm"
              onChange={this.handleChange}
            />
            <button
              className="btn btn-outline-secondary"
              style={{ margin: "10px" }}
              data-testid="edit-button"
              type="submit"
            >
              Change
            </button>
          </form>
        </div>
        <p>&nbsp;</p>
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
