import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";
import user from "@testing-library/user-event";
import Home from "./Home";
import store from "store";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import Cookie from "js-cookie";

function CreateHome(history) {
  return (
    <Router history={history}>
      <Home history={history}></Home>
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

describe("Home Container", () => {
  test("renders Home correctly", () => {
    const history = createMemoryHistory();

    const { getByTestId, debug } = render(CreateHome(history));
    expect(history.location.pathname).toEqual("/login");
  });

  test("renders Home correctly 2", () => {
    store.set("loggedIn", true);
    const history = createMemoryHistory();
    const { getByTestId, debug } = render(CreateHome(history));

    expect(history.location.pathname).toEqual("/");
  });

  test("checking navigation Home component", () => {
    const history = createMemoryHistory();
    const { getByTestId, debug } = render(CreateHome(history));

    user.click(getByTestId(/create/i));

    expect(getByTestId(/user/i)).toHaveTextContent("koko");
  });

  test("checking logout from home component", () => {
    const history = createMemoryHistory();
    const { getByTestId, debug } = render(CreateHome(history));

    user.click(getByTestId(/logout/i));
    expect(history.location.pathname).toEqual("/login");
  });
});
