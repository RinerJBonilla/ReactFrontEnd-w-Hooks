import React from "react";
import { faHeartBroken } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FourOhFour = () => {
  return (
    <div className="no found">
      <div className="d-flex justify-content-center">
        <h1 style={{ fontSize: "160px" }}>
          <FontAwesomeIcon icon={faHeartBroken} />
        </h1>
      </div>
      <div className="d-flex justify-content-center">
        <h2>404</h2>
      </div>
      <div className="d-flex justify-content-center">
        <h4>Content Not Found.</h4>
      </div>
    </div>
  );
};

export default FourOhFour;
