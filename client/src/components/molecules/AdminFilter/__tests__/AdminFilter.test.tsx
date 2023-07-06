import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AdminFilter from '../AdminFilter';

test('should render without crashing', () => {
  render(<AdminFilter />);
  const filterButton = screen.getByTitle('Filter data');
  expect(filterButton).toBeInTheDocument();
});
