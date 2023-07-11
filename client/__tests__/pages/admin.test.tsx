import { render, screen, waitFor } from '@testing-library/react';
import Admin, { getServerSideProps, loadNewsletter } from '@pages/admin';
import { mockNewsletters } from '__mocks__/data/data';

describe('Admin', () => {
  beforeEach(() => {
    render(<Admin newsletters={mockNewsletters} />);
  });

  test('renders Admin component', () => {
    expect(screen.getByTestId('admin-page')).toBeInTheDocument();
  });

  test('renders NewsLetterActions for each newsletter', async () => {
    await waitFor(() => {
      const items = screen.getAllByTestId('form');
      expect(items).toHaveLength(mockNewsletters.length);
    });
  });

  test('renders Pagination component if total pages more than 1', () => {
    // assuming pagination gets rendered only when more than 1 page of newsletters
    if (mockNewsletters.length > 5) {
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.getByText('Prev')).toBeInTheDocument();
    }
  });
});

describe('getServerSideProps function', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('should return expected props on successful fetch', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockNewsletters));

    const props = await getServerSideProps({} as any);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(props).toEqual({ props: { newsletters: mockNewsletters } });
  });

  test('should return empty array on failed fetch', async () => {
    fetchMock.mockRejectOnce(new Error('API error'));

    const props = await getServerSideProps({} as any);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(props).toEqual({ props: { newsletters: [] } });
  });
});

describe('loadNewsletter function', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('should return newsletter data on successful fetch', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockNewsletters));

    const data = await loadNewsletter();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(data).toEqual(mockNewsletters);
  });

  test('should return empty array on failed fetch', async () => {
    fetchMock.mockRejectOnce(new Error('API error'));

    const data = await loadNewsletter();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(data).toEqual([]);
  });
});
