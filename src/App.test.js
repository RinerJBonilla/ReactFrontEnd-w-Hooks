import React from "react";
import { render, cleanup } from "@testing-library/react";
import App from "./App";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

afterEach(cleanup);

test("renders App correctly", () => {
  const history = createMemoryHistory();
  const { getByTestId, debug } = render(
    <Router history={history}>
      <App></App>
    </Router>
  );
  // debug(getByTestId(/approutes/i));
});
