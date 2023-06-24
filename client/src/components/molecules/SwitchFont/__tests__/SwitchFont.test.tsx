import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import SwitchFont from "../SwitchFont";

describe("SwitchFont component", () => {
  test("renders the SwitchFont component correctly", () => {
    const { getByTestId } = render(<SwitchFont />);
    const switchFontButton = getByTestId("select-button");
    expect(switchFontButton).toBeInTheDocument();
  });

  test("changes the font family on font selection", async () => {
    const { getByTestId } = render(<SwitchFont />);
    const switchFontButton = getByTestId("select-button");
    const optionsList = getByTestId("options-list");
    const sansSerifOption = getByTestId("option-button-0");

    expect(document.body.style.getPropertyValue("--font-family")).toBe("");

    fireEvent.click(switchFontButton);
    await waitFor(() => {
      expect(optionsList).toHaveAttribute("data-open", "true");
    });

    fireEvent.click(sansSerifOption);
    await waitFor(() => {
      expect(document.body.style.getPropertyValue("--font-family")).toBe(
        "sans-serif"
      );
      expect(optionsList).toHaveAttribute("data-open", "false");
    });
  });
});
