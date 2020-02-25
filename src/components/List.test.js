import React from "react";

import List from "./List";
import { Router } from "react-router-dom";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";
import axios from "axios";
import Cookie from "js-cookie";
import { act } from "react-dom/test-utils";
import { createMemoryHistory } from "history";

jest.mock("axios");

function CreateList(history) {
  return (
    <Router history={history}>
      <List history={history}></List>
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

describe("List container", () => {
  test("renders List correctly", async () => {
    const history = createMemoryHistory();

    const data = {
      data: [
        { id: 1, title: "hello", description: "gg", content: "test" },
        { id: 2, title: "hello", description: "gg", content: "test" },
        { id: 3, title: "hello", description: "gg", content: "test" }
      ]
    };

    axios.get.mockResolvedValueOnce(data);
    let debugg;
    let getByTestId2;
    await act(async () => {
      const { getByTestId, debug } = render(CreateList(history));
      debugg = debug;
      getByTestId2 = getByTestId;
    });

    expect(getByTestId2(/myposts/i)).toHaveTextContent("My Posts");
    expect(getByTestId2(/title/i)).toHaveTextContent("Title");
    expect(getByTestId2(/description/i)).toHaveTextContent("Description");
    expect(getByTestId2(/action/i)).toHaveTextContent("Action");

    //expect(getByTestId2(/columns/i)).toMatchSnapshot();
  });
});
