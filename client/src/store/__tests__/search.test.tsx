import { act, renderHook, waitFor } from '@testing-library/react';
import { Int_Newsletter, mockNewsletters } from '__mocks__/data/data';
import useNewsletterStore, { ApiResponse } from '../useNewsletterStore';

const query = 'searched';

const expectedData = mockNewsletters.filter((newsletter) =>
  newsletter.email.includes(query)
);

// Helper functions
const mockFetchResponse = (
  responseBody: Int_Newsletter | ApiResponse | Int_Newsletter[],
  status = 200
) => {
  fetchMock.mockResponseOnce(JSON.stringify(responseBody), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

const searchSubscriberWithMockResponse = async (
  responseBody: Int_Newsletter | ApiResponse | Int_Newsletter[],
  status = 200,
  query: string
) => {
  mockFetchResponse(responseBody, status);

  const { result: store } = renderHook(() => useNewsletterStore());
  act(() => {
    store.current.searchSubscriber(query);
  });

  jest.runAllTimers();
  await waitFor(() => expect(store.current.loading).toBe(false));

  return store.current;
};

describe('useNewsletterStore', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.useFakeTimers();
    useNewsletterStore.setState({
      data: mockNewsletters,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Call searchSubscriber method', () => {
    test('should return matching newsletters when a valid query is given', async () => {
      const store = await searchSubscriberWithMockResponse(
        expectedData,
        200,
        query
      );

      expect(store.data).toEqual(expectedData);
      expect(store.errorApi).toEqual('');
    });

    test('should handle empty search results', async () => {
      const query = 'unsuccessful_query';
      const expectedData: Int_Newsletter[] = [];

      const store = await searchSubscriberWithMockResponse(
        expectedData,
        200,
        query
      );

      expect(store.data).toEqual(expectedData);
      expect(store.errorApi).toEqual('');
    });

    test('should handle API returning 400 error', async () => {
      const query = 'searched';
      const errorMessage = 'Invalid search query';
      const store = await searchSubscriberWithMockResponse(
        { success: false, error: errorMessage },
        400,
        query
      );

      expect(store.errorApi).toEqual(errorMessage);
    });

    test('should handle API returning 500 error', async () => {
      const query = 'searched';
      const errorMessage = 'Internal server error';
      const store = await searchSubscriberWithMockResponse(
        { success: false, error: errorMessage },
        500,
        query
      );

      expect(store.errorApi).toEqual(errorMessage);
    });

    test('should handle network failure', async () => {
      const query = 'searched';

      fetchMock.mockRejectOnce(new Error('Network error'));

      const { result: store } = renderHook(() => useNewsletterStore());
      act(() => {
        store.current.searchSubscriber(query);
      });

      jest.runAllTimers();

      await waitFor(() => expect(store.current.loading).toBe(false));

      expect(store.current.errorApi).toEqual('Network error');
    });

    test('should handle invalid JSON response', async () => {
      const query = 'searched';
      const errorMessage =
        'Invalid JSON response body at  reason: Unexpected token I in JSON at position 0';

      const store = await searchSubscriberWithMockResponse(
        { success: false, error: errorMessage },
        500,
        query
      );

      expect(store.errorApi).toEqual(errorMessage);
    });
  });
});
