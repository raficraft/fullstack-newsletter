import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import NewsLetterActions from '../NewsLetterActions';
import useNewsLetterStore from '@store/useNewsletterStore';

const state = useNewsLetterStore.getState();

const toggleSubscribeSpy = jest.spyOn(state, 'toggleSubscribe');
const deleteSubscribeSpy = jest.spyOn(state, 'deleteSubscribe');
const editSubscribeSpy = jest.spyOn(state, 'editSubscribe');
const setErrorApiSpy = jest.spyOn(state, 'setErrorApi');

beforeEach(() => {
  toggleSubscribeSpy.mockClear();
  deleteSubscribeSpy.mockClear();
  editSubscribeSpy.mockClear();
  setErrorApiSpy.mockClear();
  useNewsLetterStore.getState().setCurrentActiveElement('10');
});

describe('NewsLetterActions component', () => {
  // Mock properties for the NewsLetterActions component
  const propsEnabled = {
    id: '10',
    email: 'test@test.com',
    active: true,
    validation: jest.fn(),
  };

  const propsDisabled = {
    ...propsEnabled,
    active: false,
  };

  const rendered = (props: any) => {
    return render(<NewsLetterActions {...props} />);
  };

  test('Should render properly with input Enabled', () => {
    const { container } = rendered(propsEnabled);
    expect(container).toBeInTheDocument();
    expect(screen.getByTestId('iconUnsubscribe')).toBeInTheDocument();
    expect(screen.getByTestId('iconDelete')).toBeInTheDocument();
  });

  test('Should render properly with input Enabled', () => {
    const { container } = rendered(propsDisabled);
    expect(container).toBeInTheDocument();
    expect(screen.getByTestId('iconEnabled')).toBeInTheDocument();
    expect(screen.getByTestId('iconDelete')).toBeInTheDocument();
  });

  test('Should be open modal', () => {
    rendered(propsEnabled);
    fireEvent.click(screen.getByTestId('iconDelete'));
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  test('Should be close modal', () => {
    rendered(propsEnabled);
    fireEvent.click(screen.getByTestId('iconDelete'));
    fireEvent.click(screen.getByTestId('cancel'));
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  test('Should be close modal', async () => {
    rendered(propsEnabled);
    fireEvent.click(screen.getByTestId('iconDelete'));
    fireEvent.click(screen.getByTitle('Close'));
    await waitFor(() => {
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
    });
  });

  test('Should not be click on the confirm button', () => {
    rendered(propsEnabled);
    fireEvent.click(screen.getByTestId('iconDelete'));
    const button = screen.getByRole('button', { name: /confirm/i });

    expect(button).toBeDisabled();
  });

  test('Should be display error message', async () => {
    rendered(propsEnabled);
    const fields = screen.getByPlaceholderText('Edit email');
    fireEvent.change(fields, { target: { value: '' } });
    fireEvent.change(fields, { target: { value: 'abc' } });

    await waitFor(() => {
      expect(screen.getByText('Valid email required')).toBeInTheDocument();
    });
  });

  test('Should be display error message', async () => {
    rendered(propsEnabled);
    const fields = screen.getByPlaceholderText('Edit email');
    fireEvent.change(fields, { target: { value: '' } });

    fireEvent.submit(screen.getByTestId('form'));

    await waitFor(() => {
      expect(screen.getByText('Email required')).toBeInTheDocument();
    });
  });

  test('Should call editSubscribe with valid email', async () => {
    rendered(propsEnabled);
    const fields = screen.getByPlaceholderText('Edit email');
    fireEvent.change(fields, { target: { value: '' } });
    fireEvent.change(fields, { target: { value: 'email@email.com' } });

    fireEvent.submit(screen.getByTestId('form'));

    await waitFor(() => {
      expect(editSubscribeSpy).toBeCalled();
      expect(editSubscribeSpy).toBeCalledWith(
        propsEnabled.id,
        'email@email.com'
      );
    });
  });

  test('Should display error API with invalid email', async () => {
    rendered(propsEnabled);
    const fields = screen.getByPlaceholderText('Edit email');
    fireEvent.change(fields, { target: { value: '' } });
    fireEvent.change(fields, { target: { value: 'invalid email' } });

    fireEvent.submit(screen.getByTestId('form'));

    await waitFor(() => {
      useNewsLetterStore.getState().setErrorApi('Expected error message');
      expect(setErrorApiSpy).toBeCalledWith('Expected error message');
      expect(screen.getByText('Expected error message')).toBeInTheDocument();
    });
  });

  test('Should call toggleSubscribe if input is enabled', async () => {
    rendered(propsEnabled);
    fireEvent.click(screen.getByTestId('iconUnsubscribe'));

    await waitFor(() => {
      expect(toggleSubscribeSpy).toBeCalled();
      expect(toggleSubscribeSpy).toBeCalledWith(
        propsEnabled.id,
        !propsEnabled.active
      );
    });
  });

  test('Should call toggleSubscribe if input is disabled', async () => {
    rendered(propsDisabled);
    fireEvent.click(screen.getByTestId('iconEnabled'));

    await waitFor(() => {
      expect(toggleSubscribeSpy).toBeCalled();
      expect(toggleSubscribeSpy).toBeCalledWith(
        propsEnabled.id,
        !propsDisabled.active
      );
    });
  });

  test('Should be click on confirm button', async () => {
    rendered(propsEnabled);
    fireEvent.click(screen.getByTestId('iconDelete'));

    const confirmField = screen.getByPlaceholderText('Enter the text in red');
    fireEvent.change(confirmField, { target: { value: propsEnabled.email } });

    const button = screen.queryByRole('button', { name: /confirm/i });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  test('Should call deleteSubscribe and close modal when confirm button is clicked', async () => {
    rendered(propsEnabled);
    fireEvent.click(screen.getByTestId('iconDelete'));

    const confirmField = screen.getByPlaceholderText('Enter the text in red');
    fireEvent.change(confirmField, { target: { value: propsEnabled.email } });

    const button = screen.getByRole('button', { name: /confirm/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
      expect(deleteSubscribeSpy).toBeCalled();
      expect(deleteSubscribeSpy).toBeCalledWith(propsEnabled.id);
    });
  });

  test('should define currentActiveElement on input focus', async () => {
    useNewsLetterStore.getState().setCurrentActiveElement('0');
    rendered(propsEnabled);
    fireEvent.focus(screen.getByPlaceholderText('Edit email'));

    await waitFor(() => {
      expect(useNewsLetterStore.getState().currentActiveElement).toEqual('10');
    });
  });

  test('should handle toggle error toggleSubscribe', async () => {
    const mockError = new Error('Toggle error');
    toggleSubscribeSpy.mockRejectedValueOnce(mockError);

    rendered(propsEnabled);
    fireEvent.click(screen.getByTestId('toggle'));

    await waitFor(() => {
      expect(setErrorApiSpy).toHaveBeenCalledWith(mockError.message);
    });
  });

  test('should handle toggle error editSubscribe', async () => {
    const mockError = new Error('Toggle error');
    editSubscribeSpy.mockRejectedValueOnce(mockError);

    rendered(propsEnabled);

    const fields = screen.getByPlaceholderText('Edit email');
    fireEvent.change(fields, { target: { value: '' } });
    fireEvent.change(fields, { target: { value: 'email@email.com' } });

    fireEvent.submit(screen.getByTestId('form'));

    await waitFor(() => {
      expect(setErrorApiSpy).toHaveBeenCalledWith(mockError.message);
    });
  });

  test('should handle toggle error for deleteSubscribe', async () => {
    const mockError = new Error('Toggle error');
    deleteSubscribeSpy.mockRejectedValueOnce(mockError);

    rendered(propsEnabled);

    fireEvent.click(screen.getByTestId('iconDelete'));

    const confirmField = screen.getByPlaceholderText('Enter the text in red');
    fireEvent.change(confirmField, { target: { value: propsEnabled.email } });

    const button = screen.getByRole('button', { name: /confirm/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(setErrorApiSpy).toHaveBeenCalledWith(mockError.message);
    });
  });
});
