import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookie from "js-cookie";
import Axios from "axios";
import { Link } from "react-router-dom";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HomeListByTag = props => {
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
        console.log(props.match.params.name);
        const response = await Axios.get(
          process.env.REACT_APP_API_ADDRESS +
            "/searchBy/" +
            props.match.params.name,
          head
        );

        if (!response.data || response.data.length === 0) {
          setErrorLoading(true);
          return;
        }
        setPosts(response.data);
        console.log("done bringing posts");
      } catch (error) {
        console.log(error);
        setErrorLoading(true);
      }
    }

    bringContent();
  }, [props.match.params.name]);

  return (
    <div className="HomeLists">
      <h2>
        <span className="badge badge-primary" data-testid="tag_label">
          <FontAwesomeIcon icon={faTag} />
          {" " + props.match.params.name}
        </span>
      </h2>
      <div className="content--inner">
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
                    <h4 className="mb-1" data-testid={"title_" + id}>
                      {title}
                    </h4>
                  </div>
                  <p className="mb-1" data-testid={"description_" + id}>
                    {description}
                  </p>
                </Link>
              ))
          ) : (
            <p data-testid="no-post">{"No posts found."}</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HomeListByTag;
