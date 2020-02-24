import React from "react";

import Comments from "./Comments";
import { Router } from "react-router-dom";
import { render, cleanup, getAllByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";
import axios from "axios";
import Cookie from "js-cookie";
import { act } from "react-dom/test-utils";
import { createMemoryHistory } from "history";
import user from "@testing-library/user-event";

function CreateCommentList(history, comments, handleAdd) {
  return (
    <Router history={history}>
      <Comments
        history={history}
        comments={comments}
        handleAddComment={handleAdd}
      ></Comments>
    </Router>
  );
}

let comments = [];

function handleAdd(comment) {
  console.log("what I got", comment);
  const ncomment = {
    username: "koko",
    message: comment,
    id: 4
  };
  comments.push(ncomment);
}

beforeAll(() => {
  Cookie.set(
    "token",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imtva28iLCJpZCI6MTQsImlhdCI6MTU4MTQ0ODE3MX0.yH-l-IVLF_lKkZCLlkiBIgiiFOMmmiUsDnH3TOoihlU"
  );
});

afterEach(cleanup);

describe("CommentList Container", () => {
  test("renders CommentList correctly", () => {
    const history = createMemoryHistory();

    const { getByTestId, debug, queryByRole } = render(
      CreateCommentList(history, comments, handleAdd)
    );
    expect(queryByRole(/empty/i)).not.toBeNull();
    expect(queryByRole(/empty/i)).toHaveTextContent("No Comments");
  });

  test("renders CommentList correctly 2", () => {
    const history = createMemoryHistory();
    comments = [
      { id: 1, message: "hello", username: "jacob22" },
      { id: 2, message: "hello!", username: "jacob22" },
      { id: 3, message: "hello?", username: "jacob22" }
    ];
    const { getByTestId, debug, getAllByTestId } = render(
      CreateCommentList(history, comments, handleAdd)
    );
    expect(getAllByTestId(/comment/i)).toHaveLength(3);
    comments = [];
  });

  test("add a new commnet to the list", () => {
    const history = createMemoryHistory();
    comments = [
      { id: 1, message: "hello", username: "jacob22" },
      { id: 2, message: "hello!", username: "jacob22" },
      { id: 3, message: "hello?", username: "jacob22" }
    ];
    const { getByTestId, debug, getAllByTestId } = render(
      CreateCommentList(history, comments, handleAdd)
    );
    expect(getAllByTestId(/comment/i)).toHaveLength(3);

    user.type(getByTestId(/cinput/i), "new comment");
    user.click(getByTestId(/cbutton/i));

    expect(getAllByTestId(/comment/i)).toHaveLength(4);
    comments = [];
  });
});
