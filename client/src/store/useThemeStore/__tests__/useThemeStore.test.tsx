import { renderHook, act } from '@testing-library/react';
import useThemeStore from '../useThemeStore';

describe('useThemeStore', () => {
  test('should toggle theme correctly', () => {
    const { result } = renderHook(() => useThemeStore());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
  });
});
