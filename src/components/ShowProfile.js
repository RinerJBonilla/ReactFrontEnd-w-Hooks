import React, { Component } from "react";
import Axios from "axios";
import Cookie from "js-cookie";
import jwt from "jsonwebtoken";
import { Link } from "react-router-dom";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FourOhFour from "./FourOhFour";

export default class ShowProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      username: "",
      posts: "",
      myProfile: false,
      cposts: [],
      errorLoading: false,
      error: false,
      message: ""
    };
  }

  async componentDidMount() {
    var myprof = false;
    if (
      !this.props.match.params.username ||
      this.props.match.params.username === undefined
    ) {
      console.log("my profile");
      this.setState({ myProfile: true });
      myprof = true;
    }
    let head = {
      headers: {
        authtoken: Cookie.get("token")
      }
    };
    var idd = jwt.decode(Cookie.get("token"));

    const iddproved = myprof ? idd.id : this.props.match.params.username;

    try {
      const endpoint = myprof ? "/users/" : "/user/";
      const profile = await Axios.get(
        process.env.REACT_APP_API_ADDRESS + endpoint + iddproved,
        head
      );

      const endpointposts = myprof ? idd.id : profile.data.id;
      const posts = await Axios.get(
        process.env.REACT_APP_API_ADDRESS +
          "/users/" +
          endpointposts +
          "/posts",
        head
      );
      this.setState({
        username: profile.data.username,
        posts: posts.data.length,
        cposts: posts.data ? posts.data : [],
        errorLoading: posts.data.length === 0 ? true : false
      });
    } catch (error) {
      return this.setState({
        error: true,
        message: error.response.data.message
          ? error.response.data.message
          : error.response.data.error
      });
    }
  }

  sayHello() {
    console.log("you're about to edit your profile");
  }

  render() {
    const { cposts, errorLoading } = this.state;
    const mstyle = {
      borderRadius: "5px",
      padding: "20px",
      backgroundColor: "#f2f2f2",
      width: "400px"
    };
    return (
      <div>
        {!this.state.error ? (
          <div className="container">
            <div className="d-flex justify-content-center">
              <div style={mstyle}>
                <div
                  className="d-flex justify-content-center"
                  data-testid="icon-user"
                >
                  <FontAwesomeIcon
                    icon={faUserCircle}
                    style={{ fontSize: "100px" }}
                  />
                </div>
                <div
                  className="d-flex justify-content-center"
                  data-testid="username"
                >
                  <h1>{this.state.username}</h1>
                </div>
                <div
                  className="d-flex justify-content-center"
                  data-testid="counter"
                >
                  <h5 style={{ color: "#999999" }}>
                    Posts: {this.state.posts}
                  </h5>
                </div>
                {this.state.myProfile ? (
                  <div
                    className="d-flex justify-content-center"
                    data-testid="propane"
                  >
                    <Link
                      to={"/editprofile"}
                      className="btn btn-outline-secondary"
                      data-testid="editprofile"
                      onClick={this.sayHello}
                    >
                      Edit
                    </Link>
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </div>
            <div className="content--inner">
              <div className="d-flex justify-content-center">
                <h3>{this.state.username + "'s "}posts:</h3>
              </div>
              <ul className="list-group" data-testid="list">
                {!errorLoading ? (
                  cposts
                    .slice(0)
                    .reverse()
                    .map(({ id, title, description }) => (
                      <Link
                        data-testid={"postlink" + id}
                        to={"/show/" + id}
                        className="list-group-item list-group-item-action flex-column align-items-start rounded py-2"
                        style={{
                          margin: "10px",
                          borderRadius: "40px",
                          padding: "3px 10px"
                        }}
                        key={id}
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <h4 className="mb-1">{title}</h4>
                        </div>
                        <p className="mb-1">{description}</p>
                      </Link>
                    ))
                ) : (
                  <p>{"No posts"}</p>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <FourOhFour />
        )}
      </div>
    );
  }
}
