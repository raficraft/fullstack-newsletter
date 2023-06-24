import { renderHook, act, waitFor } from '@testing-library/react';
import useApiStore from '../useDictionaryApi';
import mockDictionaryApiResult from '__mocks__/apiResult/apiResult';

describe('useApiStore', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('should fetch data correctly', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([mockDictionaryApiResult]));

    const { result } = renderHook(() => useApiStore());

    act(() => {
      result.current.fetchData('test');
    });

    await waitFor(() => result.current.loading === false);

    expect(result.current.result).toEqual(mockDictionaryApiResult);
  });

  test('should set error if fetch throws an exception', async () => {
    fetchMock.mockReject(new Error('API error'));

    const { result } = renderHook(() => useApiStore());

    act(() => {
      result.current.fetchData('test');
    });

    await waitFor(() => result.current.loading === false);

    expect(result.current.error).toEqual({ message: 'No Definitions found' });
  });

  test('should set error if the response has an error property', async () => {
    // Mock the fetch function to return a response with an error property
    fetchMock.mockResponseOnce(JSON.stringify({ error: true }));

    const { result } = renderHook(() => useApiStore());

    act(() => {
      result.current.fetchData('test');
    });

    // Wait for the loading state to change
    await waitFor(() => result.current.loading === false);

    expect(result.current.error).toEqual({ message: 'No Definitions found' });
  });
});
