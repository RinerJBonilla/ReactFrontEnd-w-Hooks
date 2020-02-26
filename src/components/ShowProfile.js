import React, { Component } from "react";
import Axios from "axios";
import Cookie from "js-cookie";
import jwt from "jsonwebtoken";
import { Link } from "react-router-dom";

export default class ShowProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      username: "",
      posts: ""
    };
  }

  async componentDidMount() {
    let head = {
      headers: {
        authtoken: Cookie.get("token")
      }
    };
    var idd = jwt.decode(Cookie.get("token"));

    try {
      const profile = await Axios.get(
        "http://10.102.1.119:3001/users/" + idd.id,
        head
      );
      const posts = await Axios.get(
        "http://10.102.1.119:3001/users/" + idd.id + "/posts",
        head
      );
      this.setState({
        username: profile.data.username,
        posts: posts.data.length
      });
    } catch (error) {
      console.log("My ERROR_______", error);
    }
  }

  sayHello() {
    console.log("you're about to edit your profile");
  }

  render() {
    const mstyle = {
      borderRadius: "5px",
      padding: "20px",
      backgroundColor: "#f2f2f2",
      width: "400px"
    };
    return (
      <div className="container" style={mstyle}>
        <div className="d-flex justify-content-center" data-testid="username">
          <h1>{this.state.username}</h1>
        </div>
        <div className="d-flex justify-content-center" data-testid="counter">
          <h5 style={{ color: "#999999" }}>Posts: {this.state.posts}</h5>
        </div>
        <div className="d-flex justify-content-center" data-testid="propane">
          <Link
            to={"/editprofile"}
            className="btn btn-outline-secondary"
            data-testid="editprofile"
            onClick={this.sayHello}
          >
            Edit
          </Link>
        </div>
      </div>
    );
  }
}
