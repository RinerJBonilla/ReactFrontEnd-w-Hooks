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

    Axios.get("http://10.102.1.119:3001/users/" + userid.id + "/posts", head)
      .then(response => {
        this.setState({ post: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  delete = e => {
    console.log("delete X", e);
    // Axios.delete('http://10.102.1.119:4001/posts/'+e)
    //     .then(console.log('deleted'))
    //     .catch( err => console.log(err));
  };

  tabRow = () => {
    return this.state.post
      .slice(0)
      .reverse()
      .map((object, i) => {
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
        <h3 align="center">My Posts</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th colSpan="2">Action</th>
            </tr>
          </thead>
          <tbody>{this.tabRow()}</tbody>
        </table>
      </div>
    );
  }
}
