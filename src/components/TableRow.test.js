import React from "react";

import TableRow from "./TableRow";
import { Router } from "react-router-dom";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";
import axios from "axios";
import Cookie from "js-cookie";
import { createMemoryHistory } from "history";
import user from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

jest.mock("axios");

axios.get.mockImplementation(url => {
  switch (url) {
    case process.env.REACT_APP_API_ADDRESS + "/posts/1":
      return Promise.resolve({
        data: {
          id: 1,
          title: "hello",
          description: "gg",
          content: "this is a test",
          username: "koko"
        }
      });
    case process.env.REACT_APP_API_ADDRESS + "/posts/1/comments":
      return Promise.resolve({
        data: [
          { id: 1, username: "jacob", message: "hello" },
          { id: 2, username: "jacob", message: "hello..." },
          { id: 3, username: "jacob", message: "hello!!!!" }
        ]
      });
    default:
      return Promise.reject({
        response: { data: { message: "bad request" } }
      });
  }
});

function CreateTableRow(history, onRemove, obj) {
  return (
    <Router history={history}>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <tbody>
          <TableRow history={history} onDelete={onRemove} obj={obj}></TableRow>
        </tbody>
      </table>
    </Router>
  );
}

function onRemove() {
  console.log("we've removed a column");
}

beforeAll(() => {
  Cookie.set(
    "token",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imtva28iLCJpZCI6MTQsImlhdCI6MTU4MTQ0ODE3MX0.yH-l-IVLF_lKkZCLlkiBIgiiFOMmmiUsDnH3TOoihlU"
  );
});

afterEach(cleanup);

describe("TableRow container", () => {
  test("renders a tablerow correctly", () => {
    const history = createMemoryHistory();

    const obj = {
      id: 1,
      title: "hello",
      description: "gg",
      content: "test"
    };

    const { getByTestId, queryByRole, debug } = render(
      CreateTableRow(history, onRemove, obj)
    );

    expect(getByTestId(/obj-titl/i)).toHaveTextContent("hello");
    expect(getByTestId(/obj-desc/i)).toHaveTextContent("gg");
    expect(getByTestId(/show/i)).toHaveTextContent("View");
    expect(getByTestId(/edit/i)).toHaveTextContent("Edit");
    expect(getByTestId(/delete/i)).toHaveTextContent("Delete");
  });

  test("renders a tablerow correctly", async () => {
    const history = createMemoryHistory();

    const obj = {
      id: 1,
      title: "hello",
      description: "gg",
      content: "test"
    };

    const { getByTestId, queryByRole, debug } = render(
      CreateTableRow(history, onRemove, obj)
    );

    expect(history.location.pathname).toBe("/");

    await act(async () => {
      user.click(getByTestId(/show/i));
    });

    expect(history.location.pathname).toBe("/show/1");

    await act(async () => {
      user.click(getByTestId(/edit/i));
    });

    expect(history.location.pathname).toBe("/edit/1");
  });
});
