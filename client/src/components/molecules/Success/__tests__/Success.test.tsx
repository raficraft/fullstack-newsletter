import {
  fireEvent,
  getByText,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import Succcess from '../Success';

describe('When the component Succes is loaded with expected props', () => {
  const mockClose = jest.fn();

  beforeEach(() => {
    render(<Succcess email='email@email.com' close={mockClose} />);
  });
  test('Should be render', () => {
    const title = screen.getByText('Thank for subscribing !');
    expect(title).toBeInTheDocument();
  });

  describe('When cliked on the dismiss button', () => {
    test('Should called close function when cliked on dismiss button', () => {
      const button = screen.getByText('Dismiss Message');
      fireEvent.click(button);

      expect(mockClose).toHaveBeenCalled();
    });

    test('Should be not display component ', async () => {
      const button = screen.getByText('Dismiss Message');
      fireEvent.click(button);

      const title = screen.queryByText('Thank for subscribing !');
      waitFor(() => {
        expect(title).not.toBeInTheDocument();
      });
    });
  });
});
