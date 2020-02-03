import React, { Component } from "react";
import Axios from "axios";
import Cookie from "js-cookie";
import CommentList from "./Comments";
import jwt from "jsonwebtoken";

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
      message: ""
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
        "http://10.102.1.119:4001/posts/" + this.props.match.params.id,
        head
      );

      const comments = await Axios.get(
        "http://10.102.1.119:4001/posts/" +
          this.props.match.params.id +
          "/comments",
        head
      );

      this.setState({
        title: post.data.title,
        description: post.data.description,
        content: post.data.content,
        username: post.data.username,
        comments: comments.data
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
        userid: idd.id,
        postid: this.props.match.params.id
      };

      const response = await Axios.post(
        "http://10.102.1.119:4001/posts/" +
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

      this.setState({
        comments: newList
      });
      console.log(this.state.comments);
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
        <div className="d-flex justify-content-center">
          <h1>{this.state.title}</h1>
        </div>
        <div className="d-flex justify-content-center">
          <h5 style={{ color: "#999999" }}>{this.state.description}</h5>
        </div>
        <div className="d-flex justify-content-center">
          <small>by {this.state.username}</small>
        </div>
        <p>&nbsp;</p>
        <div className="d-flex justify-content-center">
          <div dangerouslySetInnerHTML={{ __html: this.state.content }} />
        </div>
        <p>&nbsp;</p>
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
    );
  }
}
