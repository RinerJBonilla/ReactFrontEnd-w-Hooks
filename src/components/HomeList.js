import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookie from "js-cookie";
import Axios from "axios";
import { Link } from "react-router-dom";

const HomeList = ({ history }) => {
  const [posts, setPosts] = useState([]);
  const [errorLoading, setErrorLoading] = useState(false);
  async function bringContent() {
    let head = {
      headers: {
        authtoken: Cookie.get("token")
      }
    };
    try {
      const response = await Axios.get(
        process.env.REACT_APP_API_ADDRESS + "/posts",
        head
      );
      setPosts(response.data);
      console.log("done bringing posts");
    } catch (error) {
      console.log(error);
      setErrorLoading(true);
    }
  }

  useEffect(() => {
    bringContent();
  }, []);

  return (
    <div className="container">
      <div className="d-flex justify-content-center">
        <h1>Welcome</h1>
      </div>
      <ul className="list-group" data-testid="list">
        {!errorLoading ? (
          posts
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
  );
};

export default HomeList;
