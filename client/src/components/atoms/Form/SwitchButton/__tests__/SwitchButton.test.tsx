import React from "react";
import { render, fireEvent } from "@testing-library/react";
import SwitchButton from "../SwitchButton";

describe("SwitchButton", () => {
  const mockCallback = jest.fn();

  beforeEach(() => {
    mockCallback.mockClear();
  });

  test("renders SwitchButton correctly", () => {
    const { getByText } = render(
      <SwitchButton callback={mockCallback}>Switch</SwitchButton>
    );
    expect(getByText("Switch")).toBeInTheDocument();
  });

  test("executes the callback function on change", () => {
    const { getByText } = render(
      <SwitchButton callback={mockCallback}>Switch</SwitchButton>
    );
    const switchButton = getByText("Switch");
    const switchInputElement = switchButton.querySelector(
      "input"
    ) as HTMLInputElement;

    fireEvent.click(switchInputElement); // Simulate a real click event

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
