import React, { Component } from "react";
import Axios from "axios";
import Cookie from "js-cookie";
import CommentList from "./Comments";
import jwt from "jsonwebtoken";
import { Link } from "react-router-dom";

export default class Show extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      description: "",
      content: "",
      username: "",
      comments: [],
      error: false,
      message: "",
      tags: []
    };
  }

  async componentDidMount() {
    let head = {
      headers: {
        authtoken: Cookie.get("token")
      }
    };
    console.log("res: " + this.props.match.params.id);

    try {
      const post = await Axios.get(
        process.env.REACT_APP_API_ADDRESS +
          "/posts/" +
          this.props.match.params.id,
        head
      );

      const comments = await Axios.get(
        process.env.REACT_APP_API_ADDRESS +
          "/posts/" +
          this.props.match.params.id +
          "/comments",
        head
      );

      this.setState({
        title: post.data.title,
        description: post.data.description,
        content: post.data.content,
        username: post.data.username,
        comments: comments.data,
        tags: post.data.tags ? post.data.tags : []
      });

      console.log(this.state);
    } catch (error) {
      console.log(error);
      return this.setState({
        error: true,
        message: error.response.data.message
          ? error.response.data.message
          : error.response.data.error
      });
    }
  }

  handleAddComment = async message => {
    let head = {
      headers: {
        authtoken: Cookie.get("token")
      }
    };
    try {
      var idd = jwt.decode(Cookie.get("token"));

      const sendMessage = {
        message: message,
        userid: idd.id
        //postid: this.props.match.params.id
      };

      const response = await Axios.post(
        process.env.REACT_APP_API_ADDRESS +
          "/posts/" +
          this.props.match.params.id +
          "/comments",
        sendMessage,
        head
      );
      console.log(response);

      const newList = this.state.comments;
      const newComment = {
        username: idd.username,
        message: message,
        id: response.data.insertId
      };

      newList.push(newComment);

      console.log("props changed in show dwag!");
      this.setState({
        comments: newList
      });
      console.log("see, we changed to this: ", this.state.comments);
    } catch (error) {
      console.log(error);
      return this.setState({
        error: true,
        message: error.response.data.message
          ? error.response.data.message
          : error.response.data.error
      });
    }
  };

  render() {
    return (
      <div className="container">
        <div className="d-flex justify-content-center" data-testid="title">
          <h1>{this.state.title}</h1>
        </div>
        <div
          className="d-flex justify-content-center"
          data-testid="description"
        >
          <h5 style={{ color: "#999999" }}>{this.state.description}</h5>
        </div>
        <div className="d-flex justify-content-center" data-testid="username">
          <small>by {this.state.username}</small>
        </div>
        <div className="d-flex justify-content-center">
          <ul
            className="list-group list-group-horizontal"
            data-testid="tagg-container"
          >
            {this.state.tags || this.state.tags.length > 0 ? (
              this.state.tags.map(({ id, name }) => (
                <Link
                  to={"/tag/" + name}
                  data-testid={"tags_" + id}
                  className="badge badge-primary justify-content-center"
                  key={id}
                  style={{
                    margin: "10px",
                    backgroundColor: "#78d0f8",
                    borderColor: "#78d0f8"
                  }}
                >
                  {name}
                </Link>
              ))
            ) : (
              <small>no tags</small>
            )}
          </ul>
        </div>
        <p>&nbsp;</p>
        <div className="content--inner">
          <div className="d-flex justify-content-center">
            <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
          </div>
        </div>
        <p>&nbsp;</p>
        <div className="content--inner--inner">
          <div className="d-flex justify-content-center">
            <CommentList
              comments={this.state.comments}
              handleAddComment={this.handleAddComment}
            />
          </div>
          <div className="container mb-3">
            <div className="d-flex justify-content-center mb-3">
              {this.error && (
                <div className="alert alert-danger text-center" role="alert">
                  {this.state.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
