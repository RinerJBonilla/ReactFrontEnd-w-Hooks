import React from "react";
import Register from "./Register";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";
import user from "@testing-library/user-event";
import axios from "axios";

jest.mock("axios");

afterEach(cleanup);

describe("Register container", () => {
  test("renders register correctly", () => {
    const { getByTestId } = render(<Register></Register>);
    const reginfo = getByTestId(/register-form/i);
    expect(reginfo).toHaveFormValues({
      username: "",
      password: ""
    });
  });

  test("check input forms in register", () => {
    const { getByTestId, getByPlaceholderText, queryByRole } = render(
      <Register></Register>
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
    const { getByTestId, queryByRole, findByRole } = render(
      <Register></Register>
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
    const historyMock = { push: jest.fn() };
    const { getByTestId, getByPlaceholderText, queryByRole } = render(
      <Register history={historyMock}></Register>
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
