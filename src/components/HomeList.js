import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookie from "js-cookie";
import Axios from "axios";
import { Link } from "react-router-dom";

const HomeList = ({ history }) => {
  const [posts, setPosts] = useState([]);
  const [errorLoading, setErrorLoading] = useState(false);

  useEffect(() => {
    async function bringContent() {
      let head = {
        headers: {
          authtoken: Cookie.get("token")
        }
      };
      try {
        const response = await Axios.get(
          "http://10.102.1.119:4001/posts",
          head
        );
        setPosts(response.data);
        console.log("done bringing posts");
      } catch (error) {
        console.log(error);
        setErrorLoading(true);
      }
    }

    bringContent();
  }, []);

  return (
    <div className="HomeLists">
      <ul className="list-group">
        {!errorLoading ? (
          posts
            .slice(0)
            .reverse()
            .map(({ id, title, description }) => (
              <Link
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
          <p>{"No post"}</p>
        )}
      </ul>
    </div>
  );
};

export default HomeList;
