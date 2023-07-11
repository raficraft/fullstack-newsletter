import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AdminSearch from '../AdminSearch';
import { mockNewsletters } from '__mocks__/data/data';

const useNewsLetterStoreMock = {
  data: mockNewsletters,
  errorApi: '',
  loading: false,
  filterRequest: '',
  currentActiveElement: null,
  currentAction: null,
  handleRequest: jest.fn(),
  registered: jest.fn(),
  subscribe: jest.fn(),
  deleteSubscribe: jest.fn(),
  toggleSubscribe: jest.fn(),
  editSubscribe: jest.fn(),
  filterData: jest.fn(),
  searchSubscriber: jest.fn(),
  createReqOptions: jest.fn(),
  setFilterRequest: jest.fn(),
  setData: jest.fn(),
  setErrorApi: jest.fn(),
};

// Mock du store
jest.mock('@store/useNewsletterStore', () => ({
  __esModule: true,
  default: () => useNewsLetterStoreMock,
}));

beforeEach(() => jest.resetAllMocks());

const renderer = () => {
  return render(<AdminSearch />);
};

const error = {
  required: /^Value required$/i,
  pattern: /^Two characters minimum sixty four maximum$/i,
};

describe('AdminSearch component', () => {
  test('should render properly', () => {
    const { container } = renderer();

    expect(container).toBeInTheDocument();
  });

  describe('User interaction tests', () => {
    beforeEach(() => renderer());
    describe('When the search form is submitted with an empty field', () => {
      test('should display "Value Required" error', async () => {
        const input = screen.getByPlaceholderText(/^Find a subscriber$/);
        fireEvent.submit(input);

        await waitFor(() => {
          expect(screen.getByText(error.required)).toBeInTheDocument();
          expect(useNewsLetterStoreMock.searchSubscriber).not.toBeCalled();
        });
      });
    });

    describe('When the search form is submitted with valid input', () => {
      test('should not display any error and searchSubscriber should be called once', async () => {
        const input = screen.getByPlaceholderText(/^Find a subscriber$/);
        fireEvent.input(input, { target: { value: 'abc' } });
        fireEvent.submit(input);

        await waitFor(() => {
          expect(useNewsLetterStoreMock.searchSubscriber).toBeCalled();
          expect(useNewsLetterStoreMock.searchSubscriber).toBeCalledTimes(1);
          expect(screen.queryByText(error.required)).not.toBeInTheDocument();
        });
      });
    });

    describe('When the search form is submitted with input length less than two', () => {
      test('should display any error and searchSubscriber should not be called', async () => {
        const input = screen.getByPlaceholderText(/^Find a subscriber$/);
        fireEvent.input(input, { target: { value: 'a' } });

        fireEvent.submit(input);

        await waitFor(() => {
          expect(screen.getByText(error.pattern)).toBeInTheDocument();
          expect(useNewsLetterStoreMock.searchSubscriber).not.toBeCalled();
        });
      });
    });

    describe('When the search form is submitted with input length less than two', () => {
      test('should display any error and searchSubscriber should not be called', async () => {
        const input = screen.getByPlaceholderText(/^Find a subscriber$/);
        fireEvent.input(input, {
          target: {
            value:
              "I'm a very long string containing more than sixty-four characters to illustrate a certain condition in a test case.",
          },
        });

        fireEvent.submit(input);

        await waitFor(() => {
          expect(screen.getByText(error.pattern)).toBeInTheDocument();
          expect(useNewsLetterStoreMock.searchSubscriber).not.toBeCalled();
        });
      });
    });
  });
});
