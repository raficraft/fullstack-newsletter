import { renderHook, act, waitFor } from '@testing-library/react';
import useNewsLetterStore, { ApiResponse } from '../useNewsletterStore';
import { Int_Newsletter, mockNewsletters } from '__mocks__/data/data';

const newEntry = {
  id: '5',
  email: 'test5@example.com',
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockFetchResponse = (
  responseBody: Int_Newsletter | ApiResponse,
  status = 200
) => {
  fetchMock.mockResponseOnce(JSON.stringify(responseBody), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

const subscribeWithMockResponse = async (
  responseBody: Int_Newsletter | ApiResponse,
  status = 200
) => {
  mockFetchResponse(responseBody, status);

  const { result } = renderHook(() => useNewsLetterStore());
  act(() => {
    result.current.subscribe(newEntry.email);
  });

  jest.runAllTimers();
  await waitFor(() => expect(result.current.loading).toBe(false));

  return result.current;
};

describe('useNewsLetterStore', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.useFakeTimers();
    useNewsLetterStore.setState({
      data: mockNewsletters,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Call subscribe method', () => {
    test('should subscribe correctly with email valid', async () => {
      const result = await subscribeWithMockResponse(newEntry);

      // Assert that the state has been updated with the new user
      expect(result.data).toContainEqual(newEntry);
      expect(result.errorApi).toEqual('');
    });

    test('should return error when API returns 400 error', async () => {
      const errorMessage = 'Bad request';
      const result = await subscribeWithMockResponse(
        { success: false, error: errorMessage },
        400
      );

      expect(result.errorApi).toEqual(errorMessage);
    });

    test('should return error when API returns 500 error', async () => {
      const errorMessage = 'Internal server error';
      const result = await subscribeWithMockResponse(
        { success: false, error: errorMessage },
        500
      );

      expect(result.errorApi).toEqual(errorMessage);
    });

    test('should handle network failure', async () => {
      fetchMock.mockRejectOnce(new Error('Network error'));

      const { result } = renderHook(() => useNewsLetterStore());
      act(() => {
        result.current.subscribe(newEntry.email);
      });

      jest.runAllTimers();
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.errorApi).toEqual('Network error');
    });

    test('should handle invalid JSON response', async () => {
      const errorMessage =
        'invalid json response body at  reason: Unexpected token I in JSON at position 0';
      fetchMock.mockResponseOnce('Invalid JSON', {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await subscribeWithMockResponse(
        { success: false, error: errorMessage },
        500
      );

      expect(result.errorApi).toEqual(errorMessage);
    });
  });
});
