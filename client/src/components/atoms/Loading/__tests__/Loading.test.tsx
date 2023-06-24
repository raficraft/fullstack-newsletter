import { render, screen } from '@testing-library/react';
import Loading  from '../Loading';

describe('Loading', () => {
  test('renders the loading component correctly', () => {
    render(<Loading/>);
    const loadingElement = screen.getByText(/loading/i);
    expect(loadingElement).toBeInTheDocument();
  });
});