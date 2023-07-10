import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import SubscribeNewsletter from '../SubscribeNewsletter';
import useNewsletterStore from '@store/useNewsletterStore';
import { responseApi } from '__mocks__/data/response';

const state = useNewsletterStore.getState();

const subscribeSpy = jest.spyOn(state, 'subscribe');

const mockCallback = jest.fn();

beforeEach(() => {
  subscribeSpy.mockClear();
  mockCallback.mockClear();

  useNewsletterStore.setState({
    loading: false,
    currentAction: null,
    errorApi: state.errorApi,
    subscribe: state.subscribe,
  });
});

const rendered = () => {
  return render(<SubscribeNewsletter onSuccessfulSubmit={mockCallback} />);
};

const useCases = {
  setupInvalidEmail: () => {
    const input = screen.getByRole('textbox', { name: /Email address/i });
    fireEvent.change(input, { target: { value: 'invalid email' } });

    return input;
  },
  setupValidEmail: () => {
    const input = screen.getByRole('textbox', { name: /Email address/i });
    fireEvent.change(input, { target: { value: 'email@email.com' } });

    return input;
  },

  submit: () => {
    const form = screen.getByRole('form');
    fireEvent.submit(form);
  },
};

describe('SubscribeNewsletter component', () => {
  describe('Rendering and UI interactions', () => {
    test('should render properly', () => {
      const { container } = rendered();
      expect(container).toBeInTheDocument();
    });

    test('should display error with invalid email on change', async () => {
      rendered();

      useCases.setupInvalidEmail();

      await waitFor(() => {
        expect(screen.getByText('Valid Email Required')).toBeInTheDocument();
      });
    });

    test('should remove error with valid email on change', async () => {
      rendered();

      const input = useCases.setupInvalidEmail();

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Valid Email Required'
        );
      });

      fireEvent.change(input, { target: { value: 'email@email.com' } });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('');
      });
    });

    test('should display error with invalid email on submit', async () => {
      rendered();

      useCases.setupInvalidEmail();
      useCases.submit();

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Valid Email Required'
        );
      });
    });

    test('should remove error with valid email on change', async () => {
      rendered();

      const input = useCases.setupInvalidEmail();

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Valid Email Required'
        );
      });

      fireEvent.change(input, { target: { value: 'email@email.com' } });

      useCases.submit();

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('');
      });
    });
  });

  // API

  describe('Callbacks and side effects', () => {
    test('should call callback and submit function if submit with valid email', async () => {
      fetchMock.mockResponseOnce(JSON.stringify(responseApi.subscribe.success));
      rendered();

      useCases.setupValidEmail();
      useCases.submit();

      await waitFor(() => {
        expect(subscribeSpy).toHaveBeenCalled();
        expect(subscribeSpy).toHaveBeenCalledWith('email@email.com');
        expect(mockCallback).toBeCalledWith('email@email.com');
      });
    });
  });
});
