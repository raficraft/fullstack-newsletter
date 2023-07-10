import { renderHook, act, waitFor } from '@testing-library/react';
import useNewsLetterStore, { ApiResponse } from '../useNewsletterStore';
import { Int_Newsletter, mockNewsletters } from '__mocks__/data/data';

// Mock sort result api Response

const sortNewslettersAsc = mockNewsletters.sort((a, b) =>
  a.email.localeCompare(b.email)
);
const sortNewslettersDesc = mockNewsletters.sort((a, b) =>
  b.email.localeCompare(a.email)
);

const sortedInactiveNewsletters = [...mockNewsletters]
  .filter((newsletter) => !newsletter.active)
  .sort((a, b) => a.email.localeCompare(b.email));

const sortedActiveNewsletters = [...mockNewsletters]
  .filter((newsletter) => !newsletter.active)
  .sort((a, b) => b.email.localeCompare(a.email));

const mockFilterDataResponse = (
  responseBody: Int_Newsletter[] | ApiResponse,
  status = 200
) => {
  fetchMock.mockResponseOnce(JSON.stringify(responseBody), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

const filterDataWithMockResponse = async (
  responseBody: Int_Newsletter[] | ApiResponse,
  status = 200,
  filter = {
    sortBy: 'email',
    orderBy: 'asc',
    active: 'none',
  }
) => {
  mockFilterDataResponse(responseBody, status);

  const { result: store } = renderHook(() => useNewsLetterStore());
  act(() => {
    store.current.updateFilter('sortBy', filter.sortBy);
    store.current.updateFilter('orderBy', filter.orderBy);
    const filterUrl = store.current.generateFilterUrl();
    store.current.filterData(filterUrl);
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

  // filterData
  describe('Call filterData method', () => {
    test('should filter email with default order', async () => {
      const store = await filterDataWithMockResponse(sortNewslettersAsc);

      expect(store.data).toEqual(sortNewslettersAsc);
      expect(store.errorApi).toEqual('');
    });

    test('should filter email with default order', async () => {
      const filter = {
        sortBy: 'email',
        orderBy: 'desc',
        active: 'none',
      };
      const store = await filterDataWithMockResponse(
        sortNewslettersAsc,
        200,
        filter
      );

      expect(store.data).toEqual(sortNewslettersDesc);
      expect(store.filter).toEqual(filter);
      expect(store.errorApi).toEqual('');
    });

    test('should filter email with default order', async () => {
      const filter = {
        sortBy: 'email',
        orderBy: 'desc',
        active: 'none',
      };
      const store = await filterDataWithMockResponse(
        sortNewslettersAsc,
        200,
        filter
      );

      expect(store.data).toEqual(sortNewslettersDesc);
      expect(store.filter).toEqual(filter);
      expect(store.errorApi).toEqual('');
    });

    test('should return error when API returns 400 error', async () => {
      const errorMessage = 'Invalid filter parameters';
      const store = await filterDataWithMockResponse(
        { success: false, error: errorMessage },
        400
      );

      expect(store.errorApi).toEqual(errorMessage);
    });

    test('should return error when API returns 500 error', async () => {
      const errorMessage = 'Something went wrong';
      const store = await filterDataWithMockResponse(
        { success: false, error: errorMessage },
        500
      );

      expect(store.errorApi).toEqual(errorMessage);
    });

    test('should handle invalid JSON response', async () => {
      const errorMessage =
        'invalid json response body at  reason: Unexpected token I in JSON at position 0';

      fetchMock.mockResponseOnce('Invalid JSON', {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });

      const store = await filterDataWithMockResponse(
        { success: false, error: errorMessage },
        500
      );

      expect(store.errorApi).toEqual(errorMessage);
    });
  });
});
