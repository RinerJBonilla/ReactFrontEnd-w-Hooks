import React from "react";

import Show from "./Show";
import { Router } from "react-router-dom";
import { render, cleanup, findByTestId } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";
import axios from "axios";
import Cookie from "js-cookie";
import { act } from "react-dom/test-utils";
import { createMemoryHistory } from "history";

jest.mock("axios");

axios.get.mockImplementation(url => {
  switch (url) {
    case "http://10.102.1.119:3001/posts/1":
      return Promise.resolve({
        data: {
          id: 1,
          title: "hello",
          description: "gg",
          content: "this is a test",
          username: "koko",
          tags: [
            { id: 1, name: "jest" },
            { id: 2, name: "testing" },
            { id: 3, name: "react" }
          ]
        }
      });
    case "http://10.102.1.119:3001/posts/1/comments":
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

function CreateShow(history) {
  return (
    <Router history={history}>
      <Show history={history} match={{ params: { id: 1 } }}></Show>
    </Router>
  );
}

beforeAll(() => {
  Cookie.set(
    "token",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imtva28iLCJpZCI6MTQsImlhdCI6MTU4MTQ0ODE3MX0.yH-l-IVLF_lKkZCLlkiBIgiiFOMmmiUsDnH3TOoihlU"
  );
});

afterEach(cleanup);

describe("Show Container", () => {
  test("renders Show correctly", async () => {
    const history = createMemoryHistory();
    let debugg;
    let getByTestId2;
    await act(async () => {
      const { getByTestId, debug } = render(CreateShow(history));
      debugg = debug;
      getByTestId2 = getByTestId;
    });

    expect(getByTestId2(/title/i)).toHaveTextContent("hello");
    expect(getByTestId2(/description/i)).toHaveTextContent("gg");
    expect(getByTestId2(/username/i)).toHaveTextContent("koko");

    jest.clearAllMocks();
  });

  test("renders Show correctly with tags", async () => {
    const history = createMemoryHistory();
    let debugg;
    let getByTestId2;
    await act(async () => {
      const { getByTestId, debug } = render(CreateShow(history));
      debugg = debug;
      getByTestId2 = getByTestId;
    });

    expect(getByTestId2(/title/i)).toHaveTextContent("hello");
    expect(getByTestId2(/description/i)).toHaveTextContent("gg");
    expect(getByTestId2(/username/i)).toHaveTextContent("koko");
    expect(getByTestId2(/tagg-container/i)).toBeDefined();
    expect(getByTestId2(/tags_1/i)).toHaveTextContent("jest");
    expect(getByTestId2(/tags_2/i)).toHaveTextContent("testing");
    expect(getByTestId2(/tags_3/i)).toHaveTextContent("react");

    jest.clearAllMocks();
  });
});
