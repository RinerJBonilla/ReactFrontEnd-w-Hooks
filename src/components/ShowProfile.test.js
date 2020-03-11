import React from "react";

import ShowProfile from "./ShowProfile";
import { Router } from "react-router-dom";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";
import axios from "axios";
import Cookie from "js-cookie";
import { act } from "react-dom/test-utils";
import { createMemoryHistory } from "history";
import user from "@testing-library/user-event";

jest.mock("axios");

axios.get.mockImplementation(url => {
  switch (url) {
    case process.env.REACT_APP_API_ADDRESS + "/users/14":
      return Promise.resolve({ data: { id: 14, username: "koko" } });
    case process.env.REACT_APP_API_ADDRESS + "/users/14/posts":
      return Promise.resolve({
        data: [
          { id: 1, title: "hello", description: "gg" },
          { id: 2, title: "hello", description: "gg" },
          { id: 3, title: "hello", description: "gg" }
        ]
      });
    default:
      return Promise.reject({ data: { message: "bad request" } });
  }
});

function CreateShowProfile(history) {
  return (
    <Router history={history}>
      <ShowProfile history={history}></ShowProfile>
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

describe("Show Profile Container", () => {
  test("renders ShowProfile correctly", async () => {
    const history = createMemoryHistory();
    let debugg;
    let getByTestId2;
    await act(async () => {
      const { getByTestId, debug } = render(CreateShowProfile(history));
      debugg = debug;
      getByTestId2 = getByTestId;
    });

    expect(getByTestId2(/username/i)).toHaveTextContent("koko");
    expect(getByTestId2(/counter/i)).toHaveTextContent("Posts: 3");
  });

  test("navigates to editprofile correctly", () => {
    const history = createMemoryHistory();
    history.push("/profile");
    const { getByTestId, debug } = render(CreateShowProfile(history));

    fireEvent.click(getByTestId(/editprofile/i));
  });
});
