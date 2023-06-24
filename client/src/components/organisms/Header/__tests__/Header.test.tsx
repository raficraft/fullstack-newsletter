import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header component', () => {
  it('renders IconDictionary', () => {
    render(<Header />);
    const icon = screen.getByTestId('header-icon');
    expect(icon).toBeInTheDocument();
  });
});
