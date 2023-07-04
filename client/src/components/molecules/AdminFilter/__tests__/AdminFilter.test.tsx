import { render, screen } from '@testing-library/react';
import AdminFilter from '../AdminFilter';
jest.mock('@store/useNewsletterStore', () => ({
  __esModule: true, // this property makes it work
  default: jest.fn().mockReturnValue({
    getState: jest.fn(),
    // include other properties and methods used in your component here
  }),
}));

describe('When the component is loaded', () => {
  test('Should be render', () => {
    render(<AdminFilter />);
  });
});
