import { renderHook, act, waitFor } from '@testing-library/react';
import useNewsLetterStore, { ApiResponse } from '../useNewsletterStore';
import { Int_Newsletter, mockNewsletters } from '__mocks__/data/data';

const mockFetchResponse = (
  responseBody: Int_Newsletter | ApiResponse,
  status = 200
) => {
  fetchMock.mockResponseOnce(JSON.stringify(responseBody), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

const registeredWithMockResponse = async (
  responseBody: Int_Newsletter | ApiResponse,
  status = 200
) => {
  mockFetchResponse(responseBody, status);

  const { result: store } = renderHook(() => useNewsLetterStore());
  act(() => {
    store.current.registered();
  });

  jest.runAllTimers();
  await waitFor(() => expect(store.current.loading).toBe(false));

  return store.current;
};

// Tests for the registered method
describe('Call registered method', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  test('should load newsletters correctly', async () => {
    const store = await registeredWithMockResponse(mockNewsletters[0]);

    expect(store.data).toEqual(mockNewsletters[0]);
    expect(store.errorApi).toEqual('');
  });

  test('should return error when API returns 400 error', async () => {
    const errorMessage = 'Invalid request';
    const store = await registeredWithMockResponse(
      { success: false, error: errorMessage },
      400
    );

    expect(store.errorApi).toEqual(errorMessage);
  });

  test('should return error when API returns 500 error', async () => {
    const errorMessage = 'Something went wrong';
    const store = await registeredWithMockResponse(
      { success: false, error: errorMessage },
      500
    );

    expect(store.errorApi).toEqual(errorMessage);
  });

  test('should handle network failure', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));

    const { result: store } = renderHook(() => useNewsLetterStore());
    act(() => {
      store.current.registered();
    });

    jest.runAllTimers();
    await waitFor(() => expect(store.current.loading).toBe(false));

    expect(store.current.errorApi).toEqual('Network error');
  });

  test('should handle invalid JSON response', async () => {
    const errorMessage =
      'invalid json response body at  reason: Unexpected token I in JSON at position 0';

    fetchMock.mockResponseOnce('Invalid JSON', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });

    const store = await registeredWithMockResponse(
      { success: false, error: errorMessage },
      500
    );

    expect(store.errorApi).toEqual(errorMessage);
  });
});
