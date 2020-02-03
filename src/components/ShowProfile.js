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
        "http://10.102.1.119:4001/users/" + idd.id,
        head
      );
      const posts = await Axios.get(
        "http://10.102.1.119:4001/users/" + idd.id + "/posts",
        head
      );
      this.setState({
        username: profile.data.username,
        posts: posts.data.length
      });
    } catch (error) {
      console.log(error);
    }
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
        <div className="d-flex justify-content-center">
          <h1>{this.state.username}</h1>
        </div>
        <div className="d-flex justify-content-center">
          <h5 style={{ color: "#999999" }}>Posts: {this.state.posts}</h5>
        </div>
        <div className="d-flex justify-content-center">
          <Link to={"/editprofile"} className="btn btn-outline-secondary">
            Edit
          </Link>
        </div>
      </div>
    );
  }
}
