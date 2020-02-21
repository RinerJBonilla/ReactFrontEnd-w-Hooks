import React from "react";
import ReactDOM from "react-dom";
import Login from "./Login";
import * as jestDOM from "@testing-library/jest-dom";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";
import user from "@testing-library/user-event";
import { axe } from "jest-axe";
import axios from "axios";

jest.mock("axios");

afterEach(cleanup);

test("renders learn react link", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Login></Login>, div);
});

test("component should not have vaiolations", async () => {
  const { container } = render(<Login></Login>);
  const resutls = await axe(container);
  expect(resutls).not.toHaveNoViolations();
});

test("renders login correctly", () => {
  const { getByTestId } = render(<Login></Login>);
  const loginfo = getByTestId(/login-form/i);
  expect(loginfo).toHaveFormValues({
    username: "",
    password: ""
  });
});

test("check input forms in login", () => {
  const { getByTestId, getByPlaceholderText } = render(<Login></Login>);
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
  const { getByTestId, getByPlaceholderText, queryByRole } = render(
    <Login></Login>
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
  const { getByTestId, queryByRole, findByRole, debug } = render(
    <Login></Login>
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
  const historyMock = { push: jest.fn() };
  const { getByTestId, getByPlaceholderText, queryByRole } = render(
    <Login history={historyMock}></Login>
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
