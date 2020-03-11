import React, { Component } from "react";
import Axios from "axios";
import TableRow from "./TableRow";
import Cookie from "js-cookie";
import jwt from "jsonwebtoken";

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { post: [] };
  }

  componentDidMount() {
    let head = {
      headers: {
        authtoken: Cookie.get("token")
      }
    };
    var userid = jwt.decode(Cookie.get("token"));

    Axios.get(
      process.env.REACT_APP_API_ADDRESS + "/users/" + userid.id + "/posts",
      head
    )
      .then(response => {
        this.setState({ post: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  delete = e => {
    console.log("delete X", e);
  };

  tabRow = () => {
    return this.state.post
      .slice(0)
      .reverse()
      .map((object, i) => {
        console.log(object);
        return (
          <TableRow
            obj={object}
            key={i}
            onDelete={this.delete}
            history={this.props.history}
          />
        );
      });
  };

  render() {
    return (
      <div>
        <h3 align="center" data-testid="myposts">
          My Posts
        </h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th data-testid="title">Title</th>
              <th data-testid="description">Description</th>
              <th colSpan="2" data-testid="action">
                Action
              </th>
            </tr>
          </thead>
          <tbody data-testid="columns">{this.tabRow()}</tbody>
        </table>
      </div>
    );
  }
}
