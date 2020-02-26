import React from "react";

import EditProfile from "./EditProfile";
import { Router } from "react-router-dom";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";
import axios from "axios";
import Cookie from "js-cookie";
import { createMemoryHistory } from "history";
import user from "@testing-library/user-event";

jest.mock("axios");

beforeAll(() => {
  Cookie.set(
    "token",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imtva28iLCJpZCI6MTQsImlhdCI6MTU4MTQ0ODE3MX0.yH-l-IVLF_lKkZCLlkiBIgiiFOMmmiUsDnH3TOoihlU"
  );
});

afterEach(cleanup);

describe("EditProfile Container", () => {
  test("renders container correctly", () => {
    const history = createMemoryHistory();

    const data = { data: { id: 14, username: "koko" } };

    axios.get.mockResolvedValueOnce(data);

    const { getByTestId, queryByRole, debug } = render(
      <Router history={history}>
        <EditProfile />
      </Router>
    );

    expect(getByTestId(/title/i)).toHaveTextContent("Edit My Profile");
    expect(getByTestId(/edit-form/i)).toHaveFormValues({
      username: "",
      password: "",
      confirmpassword: ""
    });
    expect(getByTestId(/edit-button/i)).toHaveTextContent("Change");
    expect(queryByRole(/alert/i)).toBeNull();

    jest.clearAllMocks();
  });

  test("test rejected request", async () => {
    const history = createMemoryHistory();

    const data = { data: { id: 14, username: "koko" } };

    const data2 = {
      response: {
        data: {
          message: "bad request"
        }
      }
    };

    axios.get.mockResolvedValueOnce(data);
    axios.put.mockRejectedValueOnce(data2);

    const { getByTestId, getByPlaceholderText, findByRole, debug } = render(
      <Router history={history}>
        <EditProfile />
      </Router>
    );

    user.type(getByPlaceholderText(/username/i), "koko2");
    user.type(getByPlaceholderText(/password/i), "12");
    user.type(getByPlaceholderText(/confirm/i), "1");

    expect(getByTestId(/edit-form/i)).toHaveFormValues({
      username: "koko2",
      password: "12",
      confirmpassword: "1"
    });

    user.click(getByTestId(/edit-button/i));

    const alert = await findByRole(/alert/i);

    expect(alert).toHaveTextContent("must confirm password");

    jest.clearAllMocks();
  });

  test("test resolved request", async () => {
    const history = createMemoryHistory();

    const data = { data: { id: 14, username: "koko" } };

    const data2 = {
      data: {
        message: "user updated"
      }
    };

    axios.get.mockResolvedValueOnce(data);
    axios.put.mockResolvedValueOnce(data2);

    const { getByTestId, getByPlaceholderText, findByRole, debug } = render(
      <Router history={history}>
        <EditProfile />
      </Router>
    );

    user.type(getByPlaceholderText(/username/i), "koko2");
    user.type(getByPlaceholderText(/password/i), "1234");
    user.type(getByPlaceholderText(/confirm/i), "1234");

    expect(getByTestId(/edit-form/i)).toHaveFormValues({
      username: "koko2",
      password: "1234",
      confirmpassword: "1234"
    });

    user.click(getByTestId(/edit-button/i));

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledTimes(1);

    jest.clearAllMocks();
  });
});
