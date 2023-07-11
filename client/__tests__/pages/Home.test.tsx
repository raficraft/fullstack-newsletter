import { render, screen } from '@testing-library/react';
import Home from '@pages/index';

describe('Admin', () => {
  test('renders Home component', () => {
    const { container } = render(<Home />);

    expect(container).toBeInTheDocument();
  });
});
