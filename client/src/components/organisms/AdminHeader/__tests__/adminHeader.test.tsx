import { getByTitle, render, screen } from '@testing-library/react';
import AdminHeader from '../AdminHeader';

describe('AdminHeader', () => {
  it('renders AdminSearch and AdminFilter', () => {
    render(<AdminHeader />);

    expect(screen.getByTestId('admin-search')).toBeInTheDocument();
    expect(screen.getByTitle('Filter data')).toBeInTheDocument();
  });
});
