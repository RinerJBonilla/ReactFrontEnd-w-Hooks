import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import App from "./App";

afterEach(cleanup);

test("renders App correctly", () => {
  const { getByTestId, debug } = render(<App></App>);
  // debug(getByTestId(/approutes/i));
});
