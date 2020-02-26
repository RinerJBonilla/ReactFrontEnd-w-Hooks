import React from "react";

import Create from "./Create";
import { Router } from "react-router-dom";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";
import axios from "axios";
import Cookie from "js-cookie";
import { createMemoryHistory } from "history";
import user from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

jest.mock("axios");

function CreateCreate(history) {
  return (
    <Router history={history}>
      <Create history={history}></Create>
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

describe("Create Container", () => {
  test("renders create container correctly", () => {
    const history = createMemoryHistory();
    const { getByTestId, queryByRole, debug } = render(CreateCreate(history));

    expect(getByTestId(/create-label/i)).toHaveTextContent("Add New Post");
    expect(getByTestId(/label-title/i)).toHaveTextContent("Title:");
    expect(getByTestId(/label-desc/i)).toHaveTextContent("Description:");
    expect(getByTestId(/cbutton/i)).toHaveTextContent("Create");

    expect(queryByRole(/alert/i)).toBeNull();

    expect(getByTestId(/ebutton/i)).toBeDefined();
  });

  test("test rejection at creating a wrong post", async () => {
    const data = {
      response: {
        data: {
          message: "bad request"
        }
      }
    };

    axios.post.mockRejectedValueOnce(data);
    const history = createMemoryHistory();
    const { getByTestId, findByRole, debug } = render(CreateCreate(history));

    user.type(getByTestId(/create-title/i), "test title");
    user.type(getByTestId(/create-desc/i), "test description");

    expect(getByTestId(/create-title/i)).toHaveValue("test title");
    expect(getByTestId(/create-desc/i)).toHaveValue("test description");

    user.click(getByTestId(/cbutton/i));

    const alert = await findByRole(/alert/i);

    expect(alert).toHaveTextContent("bad request");

    jest.clearAllMocks();
  });

  test("test resolvedpromise at creating a wright post", async () => {
    const data = {
      data: {
        message: "post created"
      }
    };

    axios.post.mockResolvedValueOnce(data);
    const history = createMemoryHistory();
    const { getByTestId, findByRole, debug } = render(CreateCreate(history));

    user.type(getByTestId(/create-title/i), "test title");
    user.type(getByTestId(/create-desc/i), "test description");

    expect(getByTestId(/create-title/i)).toHaveValue("test title");
    expect(getByTestId(/create-desc/i)).toHaveValue("test description");

    await act(async () => {
      user.click(getByTestId(/cbutton/i));
    });

    expect(axios.post).toHaveBeenCalledTimes(1);

    expect(history.location.pathname).toBe("/list");
    jest.clearAllMocks();
  });
});
