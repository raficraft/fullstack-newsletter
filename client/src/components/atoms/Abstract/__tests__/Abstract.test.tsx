import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Browser from '../Browser/Browser';
import Graphic from '../Graphic/Graphic';
import Range from '../Range/Range';
import Tablet from '../Tablet/Tablet';

describe('All Abstract component', () => {
  test('Should render Browser component', () => {
    const { container } = render(<Browser />);

    expect(container).toBeInTheDocument();
  });

  test('Should render Browser component', () => {
    const { container } = render(<Graphic />);

    expect(container).toBeInTheDocument();
  });

  test('Should render Browser component', () => {
    const { container } = render(<Range />);

    expect(container).toBeInTheDocument();
  });

  test('Should render Browser component', () => {
    const { container } = render(<Tablet />);

    expect(container).toBeInTheDocument();
  });
});
