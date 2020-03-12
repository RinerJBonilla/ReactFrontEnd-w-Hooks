import algoliasearch from "algoliasearch/lite";
import React from "react";
import { InstantSearch, Configure } from "react-instantsearch-dom";
import "./Search.css";
import {
  MySearchBox,
  CustomHits,
  CustomPagination
} from "../ultis/CustomSearchWidgets";
import { faAlgolia } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const searchClient = algoliasearch(
  process.env.REACT_APP_SEARCH_CLI,
  process.env.REACT_APP_SEARCH_PASS
);

export default function Search() {
  return (
    <div className="ais-InstantSearch">
      <h3>Search Posts</h3>
      <InstantSearch indexName="Posts" searchClient={searchClient}>
        <div className="active-cyan-4 mb-4">
          <MySearchBox />
          <small>
            Powered By{" "}
            <a href="https://www.algolia.com/" style={{ color: "#4d79ff" }}>
              <FontAwesomeIcon icon={faAlgolia} />
              <small style={{ fontWeight: "bold", color: "#4d79ff" }}>
                {" "}
                Algolia™
              </small>
            </a>
          </small>
        </div>
        <div className="content--inner">
          <CustomHits />

          <div className="d-flex justify-content-center">
            <CustomPagination />
          </div>
          <Configure hitsPerPage={6} />
        </div>
      </InstantSearch>
    </div>
  );
}
