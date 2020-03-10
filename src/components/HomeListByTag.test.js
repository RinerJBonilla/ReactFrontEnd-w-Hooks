import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import Cookie from "js-cookie";
import { act } from "react-dom/test-utils";
import axios from "axios";
import HomeListByTag from "./HomeListByTag";

jest.mock("axios");

function CreateHomeListByTag(history, tag) {
  return (
    <Router history={history}>
      <HomeListByTag
        history={history}
        match={{ params: { name: tag } }}
      ></HomeListByTag>
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

describe("HomeListByTag", () => {
  test("renders HomeListByTag correctly", async () => {
    const history = createMemoryHistory();

    const data = { data: [] };

    axios.get.mockResolvedValueOnce(data);
    let debugg;
    let getByTestId2;
    await act(async () => {
      const { getByTestId, debug } = render(
        CreateHomeListByTag(history, "food")
      );
      debugg = debug;
      getByTestId2 = getByTestId;
    });
    expect(getByTestId2(/tag_label/i)).toHaveTextContent("food");
    expect(getByTestId2(/no-post/i)).toBeDefined();
    jest.clearAllMocks();
  });

  test("renders HomeListByTag with posts", async () => {
    const history = createMemoryHistory();

    const data = {
      data: [
        { id: 1, title: "hello", description: "gg" },
        { id: 2, title: "hello", description: "gg" },
        { id: 3, title: "hello", description: "gg" }
      ]
    };

    axios.get.mockResolvedValueOnce(data);
    let debugg;
    let getByTestId2;
    let queryByTestId2;
    await act(async () => {
      const { getByTestId, debug, queryByTestId } = render(
        CreateHomeListByTag(history, "chai")
      );
      debugg = debug;
      getByTestId2 = getByTestId;
      queryByTestId2 = queryByTestId;
    });
    expect(getByTestId2(/tag_label/i)).toHaveTextContent("chai");
    expect(queryByTestId2(/no-post/i)).toBeNull();

    expect(getByTestId2(/postlink1/i)).toBeDefined();
    expect(getByTestId2(/title_1/i)).toHaveTextContent("hello");
    expect(getByTestId2(/description_1/i)).toHaveTextContent("gg");

    expect(getByTestId2(/title_2/i)).toHaveTextContent("hello");
    expect(getByTestId2(/description_2/i)).toHaveTextContent("gg");

    expect(getByTestId2(/title_3/i)).toHaveTextContent("hello");
    expect(getByTestId2(/description_3/i)).toHaveTextContent("gg");
    jest.clearAllMocks();
  });
});
