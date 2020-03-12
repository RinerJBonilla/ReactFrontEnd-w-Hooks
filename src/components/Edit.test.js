import React from "react";

import Edit from "./Edit";
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

function CreateEdit(history) {
  return (
    <Router history={history}>
      <Edit history={history} match={{ params: { id: 1 } }}></Edit>
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

describe("Edit Container", () => {
  test("renders Edit container correctly", async () => {
    const data = {
      data: {
        title: "Hellou",
        description: "mate",
        content: "it's a bit howyoudoin",
        tags: []
      }
    };

    axios.get.mockResolvedValueOnce(data);
    const history = createMemoryHistory();
    let debugg;
    let getByTestId2;
    let queryByRole2;
    await act(async () => {
      const { debug, queryByRole, getByTestId } = render(CreateEdit(history));
      debugg = debug;
      getByTestId2 = getByTestId;
      queryByRole2 = queryByRole;
    });

    expect(getByTestId2(/title-label/i)).toHaveTextContent("Title:");
    expect(getByTestId2(/edit-mypost/i)).toHaveTextContent("Edit Post");
    expect(getByTestId2(/desc-label/i)).toHaveTextContent("Description:");
    expect(getByTestId2(/ebutton/i)).toHaveTextContent("Update");

    expect(queryByRole2(/alert/i)).toBeNull();

    expect(getByTestId2(/content-editor/i)).toBeDefined();
  });

  test("test rejection at editing a wrong post", async () => {
    const data = {
      data: {
        title: "Hellou",
        description: "mate",
        content: "it's a bit howyoudoin",
        tags: []
      }
    };
    const data2 = {
      response: {
        data: {
          message: "bad request"
        }
      }
    };

    axios.get.mockResolvedValueOnce(data);
    axios.put.mockRejectedValueOnce(data2);
    const history = createMemoryHistory();
    let debugg;
    let getByTestId2;
    let findByRole2;
    await act(async () => {
      const { debug, findByRole, getByTestId } = render(CreateEdit(history));
      debugg = debug;
      getByTestId2 = getByTestId;
      findByRole2 = findByRole;
    });

    await act(async () => {
      user.click(getByTestId2(/ebutton/i));
    });

    const alert = await findByRole2(/alert/i);

    expect(alert).toHaveTextContent("bad request");

    jest.clearAllMocks();
  });

  test("test resolvedPromise at editing a wrong post", async () => {
    const data = {
      data: {
        title: "Hellou",
        description: "mate",
        content: "it's a bit howyoudoin",
        tags: []
      }
    };
    const data2 = {
      data: {
        message: "post created"
      }
    };

    axios.get.mockResolvedValueOnce(data);
    axios.put.mockResolvedValueOnce(data2);
    const history = createMemoryHistory();
    let debugg;
    let getByTestId2;
    let findByRole2;
    await act(async () => {
      const { debug, findByRole, getByTestId } = render(CreateEdit(history));
      debugg = debug;
      getByTestId2 = getByTestId;
      findByRole2 = findByRole;
    });

    await act(async () => {
      user.click(getByTestId2(/ebutton/i));
    });

    expect(axios.put).toHaveBeenCalledTimes(1);

    expect(history.location.pathname).toBe("/list");

    jest.clearAllMocks();
  });
});
