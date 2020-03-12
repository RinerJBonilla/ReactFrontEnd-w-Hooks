import React from "react";
import ReactDOM from "react-dom";
import Login from "./Login";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";
import user from "@testing-library/user-event";
import axios from "axios";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

jest.mock("axios");

afterEach(cleanup);

test("renders learn react link", () => {
  const history = createMemoryHistory();
  const div = document.createElement("div");
  ReactDOM.render(
    <Router history={history}>
      <Login history={history}></Login>
    </Router>,
    div
  );
});

test("renders login correctly", () => {
  const history = createMemoryHistory();
  const { getByTestId } = render(
    <Router history={history}>
      <Login history={history}></Login>
    </Router>
  );
  const loginfo = getByTestId(/login-form/i);
  expect(loginfo).toHaveFormValues({
    username: "",
    password: ""
  });
});

test("check input forms in login", () => {
  const history = createMemoryHistory();
  const { getByTestId, getByPlaceholderText } = render(
    <Router history={history}>
      <Login history={history}></Login>
    </Router>
  );
  const loginuser = getByPlaceholderText(/username/i);
  const loginpass = getByPlaceholderText(/password/i);

  fireEvent.change(loginuser, { target: { value: "koko" } });
  fireEvent.change(loginpass, { target: { value: "1234" } });

  const loginfo = getByTestId(/login-form/i);
  expect(loginfo).toHaveFormValues({
    username: "koko",
    password: "1234"
  });
});

test("check input forms in login as user", () => {
  const history = createMemoryHistory();
  const { getByTestId, getByPlaceholderText, queryByRole } = render(
    <Router history={history}>
      <Login history={history}></Login>
    </Router>
  );
  const loginuser = getByPlaceholderText(/username/i);
  const loginpass = getByPlaceholderText(/password/i);

  user.type(loginuser, "koko");
  user.type(loginpass, "1234");

  const loginfo = getByTestId(/login-form/i);
  expect(loginfo).toHaveFormValues({
    username: "koko",
    password: "1234"
  });

  expect(queryByRole(/alert/i)).toBeNull();
});

test("test the login rejection", async () => {
  const history = createMemoryHistory();
  const { getByTestId, queryByRole, findByRole } = render(
    <Router history={history}>
      <Login history={history}></Login>
    </Router>
  );

  const data = {
    response: {
      data: {
        message: "bad request"
      }
    }
  };

  axios.post.mockRejectedValueOnce(data);

  expect(queryByRole(/alert/i)).toBeNull();

  const loginbutton = getByTestId(/login-button/i);

  fireEvent.click(loginbutton);

  expect(axios.post).toHaveBeenCalledTimes(1);

  const alert = await findByRole(/alert/i);

  expect(alert).toHaveTextContent("bad request");

  jest.clearAllMocks();
});

test("test the login confirmation", () => {
  const history = createMemoryHistory();
  const { getByTestId, getByPlaceholderText, queryByRole } = render(
    <Router history={history}>
      <Login history={history}></Login>
    </Router>
  );
  const loginuser = getByPlaceholderText(/username/i);
  const loginpass = getByPlaceholderText(/password/i);

  const data = {
    data: {
      token: "2334ferf4frr5drgdgr"
    }
  };

  axios.post.mockResolvedValueOnce(data);

  user.type(loginuser, "koko");
  user.type(loginpass, "1234");

  const loginfo = getByTestId(/login-form/i);
  expect(loginfo).toHaveFormValues({
    username: "koko",
    password: "1234"
  });

  expect(queryByRole(/alert/i)).toBeNull();

  const loginbutton = getByTestId(/login-button/i);

  fireEvent.click(loginbutton);

  expect(axios.post).toHaveBeenCalledTimes(1);

  jest.clearAllMocks();
});
