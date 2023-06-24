import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Input, { InputProps } from "../Input";

const attributes: InputProps = {
  name: "my-input",
  id: "my-input-id",
  type: "text",
  placeholder: "Enter a text",
  tabIndex: 1,
};

describe("When Input component is loaded", () => {
  beforeEach(() => {
    render(<Input role="textbox" {...attributes} />);
  });

  test("renders without errors", () => {
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeInTheDocument();
  });

  test("the attributes went well", () => {
    const inputElement: HTMLInputElement = screen.getByRole("textbox");
    expect(inputElement.getAttribute("name")).toBe(attributes.name);
    expect(inputElement.getAttribute("id")).toBe(attributes.id);
    expect(inputElement.getAttribute("type")).toBe(attributes.type);
  });
});

describe("When Input component is loaded is disabled", () => {
  test("renders as disabled when disabled prop is true", () => {
    render(<Input role="textbox" {...attributes} disabled />);
    const inputElement: HTMLInputElement = screen.getByRole("textbox");
    expect(inputElement.disabled).toBe(true);
  });
});

describe("When the input value is changed", () => {
  test("should update the input value correctly using the ref", () => {
    const ref = React.createRef<HTMLInputElement>();

    render(<Input ref={ref} />);

    // Vérifiez si la référence est correctement transmise
    expect(ref.current).toBeDefined();

    // Simulez un changement de valeur
    fireEvent.change(ref.current!, { target: { value: "Hello" } });

    // Vérifiez si la valeur a été mise à jour correctement
    expect(ref.current!.value).toBe("Hello");
  });
});
