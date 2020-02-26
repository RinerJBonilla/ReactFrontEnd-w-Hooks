import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";
import HomeList from "./HomeList";
import store from "store";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import Cookie from "js-cookie";
import { act } from "react-dom/test-utils";
import axios from "axios";

jest.mock("axios");

function CreateHomeList(history) {
  return (
    <Router history={history}>
      <HomeList history={history}></HomeList>
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

describe("HomeList Container", () => {
  test("renders HomeList correctly", async () => {
    const history = createMemoryHistory();

    const data = { data: [] };

    axios.get.mockResolvedValueOnce(data);
    let debugg;

    await act(async () => {
      const { getByTestId, debug } = render(CreateHomeList(history));
      debugg = debug;
    });
    //debugg();
    jest.clearAllMocks();
  });

  test("renders HomeList correctly 2", async () => {
    const history = createMemoryHistory();

    const data = {
      data: [
        { id: 1, title: "hola", description: "hello" },
        { id: 2, title: "hola", description: "hello" }
      ]
    };
    let debugg;
    let getByTestId2;
    axios.get.mockResolvedValueOnce(data);
    await act(async () => {
      const { getByTestId, debug } = render(CreateHomeList(history));
      debugg = debug;
      getByTestId2 = getByTestId;
    });
    //debugg(getByTestId2(/postlink1/i));
    jest.clearAllMocks();
  });

  test("renders HomeList correctly 3", async () => {
    const history = createMemoryHistory();

    const data = {
      data: {
        message: "error"
      }
    };
    let debugg;
    axios.get.mockRejectedValueOnce(data);
    await act(async () => {
      const { getByTestId, debug } = render(CreateHomeList(history));
      debugg = debug;
    });
    //debugg();
    jest.clearAllMocks();
  });
});
