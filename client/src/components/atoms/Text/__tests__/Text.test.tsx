import React from "react";
import { render } from "@testing-library/react";
import Text from "../Text";

describe("Text component", () => {
  test("should render a paragraph by default", () => {
    const { getByText } = render(<Text>Hello, world!</Text>);
    const paragraphElement = getByText("Hello, world!");
    expect(paragraphElement.tagName).toBe("P");
  });

  test("should render the specified HTML tag", () => {
    const { getByText } = render(<Text tag="h2">Hello, world!</Text>);
    const headingElement = getByText("Hello, world!");
    expect(headingElement.tagName).toBe("H2");
  });

  test("should render additional attributes", () => {
    const { getByText } = render(
      <Text tag="span" className="text-highlight">
        Highlighted text
      </Text>
    );
    const spanElement = getByText("Highlighted text");
    expect(spanElement.tagName).toBe("SPAN");
    expect(spanElement.classList.contains("text-highlight")).toBe(true);
  });
});
