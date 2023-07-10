import { renderHook, act, waitFor } from '@testing-library/react';
import useNewsLetterStore, { ApiResponse } from '../useNewsletterStore';
import { Int_Newsletter, mockNewsletters } from '__mocks__/data/data';

const response = mockNewsletters[0];
response.email = 'test-updated@example.com';

const mockFetchResponse = (
  responseBody: Int_Newsletter | ApiResponse,
  status = 200
) => {
  fetchMock.mockResponseOnce(JSON.stringify(responseBody), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

const editSubscribeWithMockResponse = async (
  responseBody: Int_Newsletter | ApiResponse,
  status = 200
) => {
  mockFetchResponse(responseBody, status);

  const { result: store } = renderHook(() => useNewsLetterStore());
  act(() => {
    store.current.editSubscribe(
      mockNewsletters[0].id,
      'test-updated@example.com'
    );
  });

  jest.runAllTimers();
  await waitFor(() => expect(store.current.loading).toBe(false));

  return store.current;
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

  // editSubscribe

  describe('Call editSubscribe method', () => {
    test('should edit subscribe correctly with valid id and email', async () => {
      const store = await editSubscribeWithMockResponse(response);

      // Exclude createAt and updateAt checking

      expect(store.data[0]).toEqual(
        expect.objectContaining({
          id: response.id,
          email: response.email,
          active: response.active,
        })
      );
      expect(store.errorApi).toEqual('');
    });

    test('should return error when API returns 400 error', async () => {
      const errorMessage = 'Invalid value for "email". Expected a string.';
      const store = await editSubscribeWithMockResponse(
        { success: false, error: errorMessage },
        400
      );

      expect(store.errorApi).toEqual(errorMessage);
    });

    test('should return error when API returns 500 error', async () => {
      const errorMessage = 'Something went wrong';
      const store = await editSubscribeWithMockResponse(
        { success: false, error: errorMessage },
        500
      );

      expect(store.errorApi).toEqual(errorMessage);
    });

    test('should handle network failure', async () => {
      fetchMock.mockRejectOnce(new Error('Network error'));

      const { result: store } = renderHook(() => useNewsLetterStore());
      act(() => {
        store.current.editSubscribe(
          mockNewsletters[0].id,
          'test-updated@example.com'
        );
      });

      jest.runAllTimers();
      await waitFor(() => expect(store.current.loading).toBe(false));

      expect(store.current.errorApi).toEqual('Network error');
    });

    test('should handle invalid JSON response', async () => {
      fetchMock.mockResponseOnce('Invalid JSON', {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });

      const store = await editSubscribeWithMockResponse(response, 500);

      expect(store.errorApi).toEqual(
        'invalid json response body at  reason: Unexpected token I in JSON at position 0'
      );
    });
  });
});
