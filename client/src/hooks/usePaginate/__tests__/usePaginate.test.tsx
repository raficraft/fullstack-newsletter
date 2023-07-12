import { act, renderHook } from '@testing-library/react';
import usePaginate from '../usePaginate';

describe('usePaginate', () => {
  const data = Array(50)
    .fill(null)
    .map((_, i) => i); 

  test('should initialize correctly', () => {
    const { result } = renderHook(() => usePaginate(data, 10));

    expect(result.current.currentPage).toBe(0);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.items).toEqual(data.slice(0, 10));
  });

  test('should paginate to next page correctly', () => {
    const { result } = renderHook(() => usePaginate(data, 10));

    act(() => result.current.nextPage());

    expect(result.current.currentPage).toBe(1);
    expect(result.current.items).toEqual(data.slice(10, 20));
  });

  test('should not paginate beyond the last page', () => {
    const { result } = renderHook(() => usePaginate(data, 10));

    for (let i = 0; i < 10; i++) {
      act(() => result.current.nextPage());
    }

    expect(result.current.currentPage).toBe(4);
    expect(result.current.items).toEqual(data.slice(40, 50));
  });

  test('should paginate to previous page correctly', () => {
    const { result } = renderHook(() => usePaginate(data, 10));

    act(() => result.current.nextPage());
    act(() => result.current.prevPage());

    expect(result.current.currentPage).toBe(0);
    expect(result.current.items).toEqual(data.slice(0, 10));
  });

  test('should not paginate before the first page', () => {
    const { result } = renderHook(() => usePaginate(data, 10));

    act(() => result.current.prevPage());

    expect(result.current.currentPage).toBe(0);
    expect(result.current.items).toEqual(data.slice(0, 10));
  });
});
