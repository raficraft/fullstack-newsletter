import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import SearchWord from '../SearchWord';

describe('SearchWord', () => {
  // Render

  test('renders without errors', () => {
    const { container } = render(<SearchWord />);
    expect(container).toBeInTheDocument();
  });

  // Good user interaction

  test('calls callApi function on form submit test', async () => {
    const { getByPlaceholderText, getByRole, queryByRole } = render(
      <SearchWord />
    );

    const searchInput = getByPlaceholderText('Search for any word');
    const error = queryByRole('alert');

    fireEvent.input(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(error?.textContent).toBe('');
    });
  });

  test('calls callApi function on form submit 123, trigger Error', async () => {
    const { getByPlaceholderText, getByText } = render(<SearchWord />);

    const searchInput = getByPlaceholderText('Search for any word');
    const error = 'You can only use alphabetic characters';

    fireEvent.input(searchInput, {
      target: { value: '123' },
    });

    await waitFor(() => {
      expect(getByText(error)).toBeInTheDocument();
    });
  });

  test('calls callApi function on form submit empty field, trigger Error', async () => {
    const { getByRole, getByText } = render(<SearchWord />);

    const form = getByRole('form');

    fireEvent.submit(form);

    await waitFor(() => {
      expect(getByText('Whoops, can’t be empty…')).toBeInTheDocument();
    });
  });

  test('remove Error', async () => {
    const { getByPlaceholderText, getByRole } = render(<SearchWord />);

    const searchInput = getByPlaceholderText('Search for any word');
    const form = getByRole('form');
    const error = getByRole('alert');

    fireEvent.submit(form);

    await waitFor(() => {
      expect(error).toBeInTheDocument();
    });

    fireEvent.input(searchInput, {
      target: { value: 'test' },
    });

    await waitFor(() => {
      expect(error?.textContent).toBe('');
    });
  });

  test('Error change', async () => {
    const { getByPlaceholderText, getByRole, getByText } = render(
      <SearchWord />
    );
    const form = getByRole('form');
    const error = getByRole('alert');
    const searchInput = getByPlaceholderText('Search for any word');

    fireEvent.submit(form);

    await waitFor(() => {
      expect(error.textContent).toBe('Whoops, can’t be empty…');
    });

    fireEvent.input(searchInput, {
      target: { value: '123' },
    });

    await waitFor(() => {
      const otherError = getByText('You can only use alphabetic characters');
      expect(otherError).toBeInTheDocument();
    });
  });
});
