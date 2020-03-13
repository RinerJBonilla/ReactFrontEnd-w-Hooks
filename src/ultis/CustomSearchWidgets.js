import React from "react";
import {
  connectSearchBox,
  connectHits,
  connectPagination,
  connectHighlight
} from "react-instantsearch-dom";
import { Link } from "react-router-dom";

export const SearchBox = ({ currentRefinement, refine }) => {
  var searchcontent;
  return (
    <input
      className="form-control"
      type="text"
      placeholder="Search"
      value={searchcontent}
      onChange={e => {
        searchcontent = e.target.value;
      }}
      onKeyDown={e => {
        if (e.key === "Enter") {
          refine(searchcontent);
          e.target.value = null;
        }
      }}
    />
  );
};

export const MySearchBox = connectSearchBox(SearchBox);

const Highlight = ({ highlight, attribute, hit }) => {
  const parsedHit = highlight({
    highlightProperty: "_highlightResult",
    attribute,
    hit
  });

  return (
    <span>
      {parsedHit.map((part, index) =>
        part.isHighlighted ? (
          <mark key={index}>{part.value}</mark>
        ) : (
          <span key={index}>{part.value}</span>
        )
      )}
    </span>
  );
};

const CustomHighlight = connectHighlight(Highlight);

const Hits = ({ hits }) => (
  <ul className="list-group" data-testid="list">
    {hits
      .slice(0)
      .reverse()
      .map(hit => (
        <Link
          data-testid={"postlink" + hit.objectID}
          to={"/show/" + hit.objectID}
          className="list-group-item list-group-item-action flex-column align-items-start rounded py-2"
          style={{
            margin: "10px",
            borderRadius: "40px",
            padding: "3px 10px"
          }}
          key={hit.objectID}
        >
          <div className="d-flex w-100 justify-content-between">
            <h4 className="mb-1" data-testid={"title_" + hit.objectID}>
              <CustomHighlight hit={hit} attribute="title" />
            </h4>
          </div>
          <p className="mb-1" data-testid={"description_" + hit.objectID}>
            <CustomHighlight hit={hit} attribute="description" />
          </p>
        </Link>
      ))}
  </ul>
);

export const CustomHits = connectHits(Hits);

const Pagination = ({ currentRefinement, nbPages, refine, createURL }) => (
  <ul className="list-group list-group-horizontal">
    {new Array(nbPages).fill(null).map((_, index) => {
      const page = index + 1;
      const classer =
        currentRefinement === page
          ? "list-group-item list-group-item-dark list-group-item-action"
          : "list-group-item list-group-item-light list-group-item-action";

      return (
        <small>
          <a
            type="button"
            className={classer}
            href={createURL(page)}
            onClick={event => {
              event.preventDefault();
              refine(page);
            }}
          >
            {page}
          </a>
        </small>
      );
    })}
  </ul>
);

export const CustomPagination = connectPagination(Pagination);
