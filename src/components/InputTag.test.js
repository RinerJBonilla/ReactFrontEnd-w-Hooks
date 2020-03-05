import React from "react";
import InputTag from "./InputTag";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "jest-axe/extend-expect";
import { createMemoryHistory } from "history";
import Cookie from "js-cookie";
import { Router } from "react-router-dom";

function CreateInputTag(history, handleInputs, tags) {
  return (
    <Router history={history}>
      <InputTag ChangeInputs={handleInputs} tags={tags}></InputTag>
    </Router>
  );
}

function handleInputs(tags) {
  console.log(tags);
}

beforeAll(() => {
  Cookie.set(
    "token",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imtva28iLCJpZCI6MTQsImlhdCI6MTU4MTQ0ODE3MX0.yH-l-IVLF_lKkZCLlkiBIgiiFOMmmiUsDnH3TOoihlU"
  );
});

afterEach(cleanup);

describe("InputTag Container", () => {
  test("renders inputtag correctly", () => {
    const history = createMemoryHistory();
    const tags = [];

    const { getByTestId, queryByTestId } = render(
      CreateInputTag(history, handleInputs, tags)
    );

    expect(getByTestId(/tag-container/i)).toBeDefined();
    expect(queryByTestId(/element_0/i)).toBeNull();
    expect(queryByTestId(/btn_0/i)).toBeNull();

    expect(getByTestId(/keydown/i)).toBeDefined();
    expect(getByTestId(/text-input/i)).toHaveTextContent("");
  });

  test("renders inputtag correctly 2", () => {
    const history = createMemoryHistory();
    const tags = ["food", "sushi"];

    const { getByTestId, debug } = render(
      CreateInputTag(history, handleInputs, tags)
    );

    expect(getByTestId(/tag-container/i)).toBeDefined();
    expect(getByTestId(/element_0/i)).toHaveTextContent("food");
    expect(getByTestId(/btn_0/i)).toHaveTextContent("+");

    expect(getByTestId(/keydown/i)).toBeDefined();
    expect(getByTestId(/text-input/i)).toHaveTextContent("");
  });

  test("test input actions of enter(add), X button(delete) & backspace(delete_last)", () => {
    const history = createMemoryHistory();
    const tags = [];

    const { getByTestId, queryByTestId, debug } = render(
      CreateInputTag(history, handleInputs, tags)
    );

    expect(getByTestId(/tag-container/i)).toBeDefined();
    expect(queryByTestId(/element_0/i)).toBeNull();
    expect(queryByTestId(/btn_0/i)).toBeNull();
    expect(getByTestId(/text-input/i)).toHaveTextContent("");

    const inputtext = getByTestId(/text-input/i);

    fireEvent.change(inputtext, { target: { value: "food" } });
    fireEvent.keyDown(inputtext, { key: "Enter", code: 13 });

    expect(getByTestId(/element_0/i)).toHaveTextContent("food");
    expect(getByTestId(/btn_0/i)).toHaveTextContent("+");

    fireEvent.change(inputtext, { target: { value: "sushi" } });
    fireEvent.keyDown(inputtext, { key: "Enter", code: 13 });

    expect(getByTestId(/element_1/i)).toHaveTextContent("sushi");
    expect(getByTestId(/btn_1/i)).toHaveTextContent("+");

    fireEvent.click(getByTestId(/btn_0/i));

    expect(getByTestId(/element_0/i)).toHaveTextContent("sushi");
    expect(getByTestId(/btn_0/i)).toHaveTextContent("+");

    fireEvent.keyDown(inputtext, { key: "Backspace", code: 8 });

    expect(queryByTestId(/element_0/i)).toBeNull();
    expect(queryByTestId(/btn_0/i)).toBeNull();
  });

  test("check that input cannot accept duplicates on the tag list", () => {
    const history = createMemoryHistory();
    const tags = ["food", "thai", "cute"];

    const { getByTestId, queryByTestId, debug } = render(
      CreateInputTag(history, handleInputs, tags)
    );

    const inputtext = getByTestId(/text-input/i);

    fireEvent.change(inputtext, { target: { value: "food" } });
    fireEvent.keyDown(inputtext, { key: "Enter", code: 13 });

    expect(queryByTestId(/element_3/i)).toBeNull();
    expect(queryByTestId(/btn_3/i)).toBeNull();

    fireEvent.change(inputtext, { target: { value: "ThaI" } });
    fireEvent.keyDown(inputtext, { key: "Enter", code: 13 });

    expect(queryByTestId(/element_3/i)).toBeNull();
    expect(queryByTestId(/btn_3/i)).toBeNull();

    fireEvent.change(inputtext, { target: { value: "CUTE" } });
    fireEvent.keyDown(inputtext, { key: "Enter", code: 13 });

    expect(queryByTestId(/element_3/i)).toBeNull();
    expect(queryByTestId(/btn_3/i)).toBeNull();
  });
});
