import React from 'react';
import { render } from '@testing-library/react';
import Field from '../Field';

describe('Field', () => {
  test('renders without error', () => {
    render(<Field />);
  });

  test('renders children correctly', () => {
    const { getByText } = render(<Field>Child Component</Field>);
    const childComponent = getByText('Child Component');
    expect(childComponent).toBeInTheDocument();
  });

  test('renders input element with provided attributes', () => {
    const { getByTestId } = render(<Field data-testid='input' />);
    const inputElement = getByTestId('input');
    expect(inputElement).toBeInTheDocument();
  });

  test('renders error message when error prop is provided', () => {
    const { getByText } = render(<Field error='Invalid input' />);
    const errorMessage = getByText('Invalid input');
    expect(errorMessage).toBeInTheDocument();
  });

  test('renders svg element when svg prop is provided', () => {
    const { getByTestId } = render(<Field svg={<svg data-testid='svg' />} />);
    const svgElement = getByTestId('svg');
    expect(svgElement).toBeInTheDocument();
  });

  test('renders reverse children correctly', () => {
    const { getByText } = render(<Field reverse>Child Component</Field>);
    const childComponent = getByText('Child Component');
    expect(childComponent).toBeInTheDocument();
  });

  test('renders spinner', () => {
    const { getByTestId } = render(
      <Field loading={true}>Child Component</Field>
    );
    const spinner = getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
  });
});
