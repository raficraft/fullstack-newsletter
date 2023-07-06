import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import FilterDialog from '../FilterDialog';
import useNewsLetterStore, { StoreActions } from '@store/useNewsletterStore';

// Mock du store
jest.mock('@store/useNewsletterStore');

let mockHandleRequest = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  useNewsLetterStore.mockImplementation(() => ({
    data: [],
    errorApi: '',
    loading: false,
    filterRequest: '',
    currentActiveElement: null,
    currentAction: null,
    handleRequest: mockHandleRequest,
    updateFilter: jest.fn(),
    generateFilterUrl: jest.fn().mockReturnValue('?sortBy=createdAt&order=asc'),
    filterData: jest.fn(),
    setFilterRequest: jest.fn(),
    registered: jest.fn(),
    subscribe: jest.fn(),
    deleteSubscribe: jest.fn(),
    toggleSubscribe: jest.fn(),
    editSubscribe: jest.fn(),
    searchSubscriber: jest.fn(),
    createReqOptions: jest.fn(),
    setData: jest.fn(),
    setErrorApi: jest.fn(),
    resetFilter: jest.fn(),
  }));
});

const closeDialog = jest.fn();

const renderer = () => {
  return render(<FilterDialog closeDialog={closeDialog} />);
};

describe('AdminFilter component', () => {
  test('should render properly', () => {
    const { container } = renderer();
    expect(container).toBeInTheDocument();
  });

  test('CloseDialog correctly called when click on filter button', async () => {
    renderer();
    const filterBtn = screen.getByRole('button', { name: 'Filter' });
    fireEvent.click(filterBtn);
    await waitFor(() => {
      expect(closeDialog).toBeCalled();
    });
  });

  test('generateFilterUrl is correctly called when click on filter button', async () => {
    renderer();
    const filterBtn = screen.getByRole('button', { name: 'Filter' });
    fireEvent.click(filterBtn);
    await waitFor(() => {
      expect(useNewsLetterStore().generateFilterUrl).toHaveBeenCalledTimes(1);
    });
  });

  test('filterData is correctly called when click on filter button', async () => {
    const generateFilterUrl = useNewsLetterStore().generateFilterUrl;
    renderer();
    const filterBtn = screen.getByRole('button', { name: 'Filter' });
    fireEvent.click(filterBtn);
    await waitFor(() => {
      expect(useNewsLetterStore().filterData).toHaveBeenCalledTimes(1);
      expect(useNewsLetterStore().filterData).toHaveBeenCalledWith(
        generateFilterUrl()
      );
    });
  });
});
