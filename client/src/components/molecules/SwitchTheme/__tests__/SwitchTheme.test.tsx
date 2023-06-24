import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SwitchTheme from '../SwitchTheme';
jest.mock('zustand');

describe('SwitchTheme component', () => {
  test('renders the SwitchTheme component correctly', () => {
    const { getByTestId } = render(<SwitchTheme />);
    const switchTheme = getByTestId('switch-theme-button');
    expect(switchTheme).toBeInTheDocument();
  });

  test('changes the body data-theme attribute on theme switch', async () => {
    const { getByTestId } = render(<SwitchTheme />);

    const switchButton = getByTestId('switch-theme-button');
    fireEvent.click(switchButton);

    await waitFor(() => {
      expect(document.body.getAttribute('data-theme')).toBe('dark');
    });
  });

  test('renders the SwitchTheme component correctly with different themes', () => {
    const { getByTestId } = render(<SwitchTheme />);

    expect(getByTestId('switch-theme-button')).toHaveAttribute(
      'data-theme',
      'light'
    );

    fireEvent.click(getByTestId('switch-theme-button'));
    expect(getByTestId('switch-theme-button')).toHaveAttribute(
      'data-theme',
      'dark'
    );

    fireEvent.click(getByTestId('switch-theme-button'));
    expect(getByTestId('switch-theme-button')).toHaveAttribute(
      'data-theme',
      'light'
    );
  });
});
