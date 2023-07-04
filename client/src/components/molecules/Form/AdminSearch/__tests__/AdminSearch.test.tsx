import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AdminSearch from '../AdminSearch';
import { useForm } from '@hooks/index';
jest.mock('hooks/useForm');

describe('When the component AdminSearch is loaded', () => {
  const renderer = () => {
    return render(<AdminSearch />);
  };

  const error = {
    empty: /^Value required$/,
    tooShort: /^Two characters minimum$/,
  };

  test('Should be render', () => {
    const { container } = renderer();

    expect(container).toBeInTheDocument();
  });

  describe('When the user performs a wrong action ', () => {
    describe('When user submit search with an empty field', () => {
      test('Should be display error Value Required', () => {
        renderer();

        const input = screen.getByPlaceholderText(/^Find a subscriber$/);
        fireEvent.submit(input);

        expect(screen.getByText(error.empty)).toBeInTheDocument();
      });
    });

    describe('When user submit search with an empty field and ....', () => {
      test('Should be not display error', () => {
        renderer();

        const input = screen.getByPlaceholderText(/^Find a subscriber$/);
        fireEvent.submit(input);

        expect(screen.getByText(error.empty)).toBeInTheDocument();

        fireEvent.input(input, { target: { value: 'abc' } });

        expect(screen.queryByText(error.empty)).not.toBeInTheDocument();
      });
    });

    describe('When user submit search with an empty field and ....', () => {
      test('Should be not display error', async () => {
        renderer();

        const input = screen.getByPlaceholderText(/^Find a subscriber$/);

        fireEvent.input(input, { target: { value: 'a' } });

        waitFor(() => {
          expect(useForm({ fields: {} }).validateField).toHaveBeenCalled();
          expect(screen.getByText(error.tooShort)).toBeInTheDocument();
        });
      });
    });
  });
});
