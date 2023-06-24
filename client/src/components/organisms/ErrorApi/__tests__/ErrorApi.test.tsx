import React from "react";
import { render } from "@testing-library/react";
import ErrorApi from "../ErrorApi";

describe("ErrorApi component", () => {
  test("renders the ErrorApi component correctly", () => {
    const { getByAltText, getByText } = render(<ErrorApi />);

    const image = getByAltText("oups");
    const title = getByText("No Definitions Found");
    const message = getByText(
      "Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at later time or head to the web instead."
    );

    expect(image).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
  });
});
