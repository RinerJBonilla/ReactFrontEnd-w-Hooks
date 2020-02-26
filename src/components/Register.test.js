import React from "react";
import Register from "./Register";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";
import user from "@testing-library/user-event";
import axios from "axios";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

jest.mock("axios");

afterEach(cleanup);

describe("Register container", () => {
  test("renders register correctly", () => {
    const history = createMemoryHistory();
    const { getByTestId } = render(
      <Router history={history}>
        <Register history={history}></Register>
      </Router>
    );
    const reginfo = getByTestId(/register-form/i);
    expect(reginfo).toHaveFormValues({
      username: "",
      password: ""
    });
  });

  test("check input forms in register", () => {
    const history = createMemoryHistory();
    const { getByTestId, getByPlaceholderText, queryByRole } = render(
      <Router history={history}>
        <Register history={history}></Register>
      </Router>
    );
    const reguser = getByPlaceholderText(/username/i);
    const regpass = getByPlaceholderText(/password/i);

    user.type(reguser, "koko");
    user.type(regpass, "1234");

    const reginfo = getByTestId(/register-form/i);
    expect(reginfo).toHaveFormValues({
      username: "koko",
      password: "1234"
    });

    expect(queryByRole(/alert/i)).toBeNull();
  });

  test("test the register rejection", async () => {
    const history = createMemoryHistory();
    const { getByTestId, queryByRole, findByRole } = render(
      <Router history={history}>
        <Register history={history}></Register>
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

    const regbutton = getByTestId(/register-button/i);

    fireEvent.click(regbutton);

    expect(axios.post).toHaveBeenCalledTimes(1);

    const alert = await findByRole(/alert/i);

    expect(alert).toHaveTextContent("bad request");

    jest.clearAllMocks();
  });

  test("test the login confirmation", () => {
    const historyMock = createMemoryHistory();
    const { getByTestId, getByPlaceholderText, queryByRole } = render(
      <Router history={historyMock}>
        <Register history={historyMock}></Register>
      </Router>
    );
    const reguser = getByPlaceholderText(/username/i);
    const regpass = getByPlaceholderText(/password/i);

    const data = {
      data: {
        message: "you've signed up. yay!"
      }
    };

    axios.post.mockResolvedValueOnce(data);

    user.type(reguser, "koko");
    user.type(regpass, "1234");

    const reginfo = getByTestId(/register-form/i);
    expect(reginfo).toHaveFormValues({
      username: "koko",
      password: "1234"
    });

    expect(queryByRole(/alert/i)).toBeNull();

    const regbutton = getByTestId(/register-button/i);

    fireEvent.click(regbutton);

    expect(axios.post).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();
  });
});
