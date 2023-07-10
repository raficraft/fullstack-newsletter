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

const deleteWithMockResponse = async (
  responseBody: Int_Newsletter | ApiResponse,
  status = 200
) => {
  mockFetchResponse(responseBody, status);

  const { result: store } = renderHook(() => useNewsLetterStore());
  act(() => {
    store.current.deleteSubscribe(mockNewsletters[0].id);
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

  // deleteSubscribe

  describe('Call deleteSubscribe method', () => {
    test('should delete correctly with valid id', async () => {
      const deletedData = mockNewsletters[0];
      const response = deletedData;

      const store = await deleteWithMockResponse(response);

      // Test 'should delete correctly with valid id'
      // This test verifies that the deleteSubscribe method of the newsletter store works correctly.
      // It makes a mock API call with a valid ID for deletion and checks that the API responds with a success status and returns the deleted data.
      // Then, it asserts the following conditions:
      // 1. The API response should indicate a successful operation.
      // 2. The error message in the store should be empty as no error has occurred.
      // 3. The deleted data should not exist in the store's data anymore. This is checked by trying to find the deleted data in the store's data.
      //    If the deletion was successful, this find operation should return 'undefined'. Therefore, we use `.toBeUndefined()` to verify that the element has been properly deleted.

      expect(
        store.data.find((item: Int_Newsletter) => item.id === deletedData.id)
      ).toBeUndefined();
      expect(store.errorApi).toEqual('');
    });

    test('should return error when API returns 400 error', async () => {
      const errorMessage = 'Bad request';
      const store = await deleteWithMockResponse(
        { success: false, error: errorMessage },
        400
      );

      expect(store.errorApi).toEqual(errorMessage);
    });

    test('should return error when API returns 500 error', async () => {
      const errorMessage = 'Internal server error';
      const store = await deleteWithMockResponse(
        { success: false, error: errorMessage },
        500
      );

      expect(store.errorApi).toEqual(errorMessage);
    });

    test('should handle network failure', async () => {
      fetchMock.mockRejectOnce(new Error('Network error'));

      const { result: store } = renderHook(() => useNewsLetterStore());
      act(() => {
        store.current.deleteSubscribe(mockNewsletters[0].id);
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

      const store = await deleteWithMockResponse(mockNewsletters[0], 500);

      expect(store.errorApi).toEqual(errorMessage);
    });
  });
});
