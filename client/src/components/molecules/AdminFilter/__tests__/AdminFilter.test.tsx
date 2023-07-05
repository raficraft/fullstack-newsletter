import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  within,
} from '@testing-library/react';
import AdminFilter from '../AdminFilter';
import useNewsLetterStore from '@store/useNewsletterStore';

describe('AdminFilter Component', () => {
  test('Should render without crashing', () => {
    render(<AdminFilter />);
    const filterButton = screen.getByTitle('Filter data');
    expect(filterButton).toBeInTheDocument();
  });

  test("Should open modal when 'Filter data' button is clicked", async () => {
    render(<AdminFilter />);
    const filterButton = screen.getByTitle('Filter data');
    fireEvent.click(filterButton);
    await waitFor(() =>
      expect(screen.getByText('Sort by :')).toBeInTheDocument()
    );
  });

  test("Should close modal when 'Close' button is clicked", async () => {
    render(<AdminFilter />);
    const filterButton = screen.getByTitle('Filter data');
    fireEvent.click(filterButton);

    await waitFor(() =>
      expect(screen.getByText('Sort by :')).toBeInTheDocument()
    );

    const closeButton = screen.getByTitle('Close modal');
    fireEvent.click(closeButton);

    await waitFor(() =>
      expect(screen.queryByText('Sort by :')).not.toBeInTheDocument()
    );
  });

  test("Should update filter state and call filterData when 'Filtrer' button is clicked", async () => {
    render(<AdminFilter />);
    const filterButton = screen.getByTitle('Filter data');
    fireEvent.click(filterButton);

    const originalFilterData = useNewsLetterStore.getState().filterData;
    const originalSetFilterRequest =
      useNewsLetterStore.getState().setFilterRequest;

    const mockFilterData = jest.fn();
    const mockSetFilterRequest = jest.fn();

    act(() => {
      useNewsLetterStore.setState({
        filterData: mockFilterData,
        setFilterRequest: mockSetFilterRequest,
      });
    });

    await waitFor(() => {
      const filtrerButton = screen.getByText('Filter');
      fireEvent.click(filtrerButton);
    });

    expect(mockFilterData).toHaveBeenCalledTimes(1);
    expect(mockSetFilterRequest).toHaveBeenCalledWith(
      '?sortBy=createdAt&order=asc'
    );

    // Reset to original functions after the test
    act(() => {
      useNewsLetterStore.setState({
        filterData: originalFilterData,
        setFilterRequest: originalSetFilterRequest,
      });
    });
  });

  test('should change filter fields values when dropdown options are selected', async () => {
    render(<AdminFilter />);
    const filterButton = screen.getByTitle('Filter data');
    fireEvent.click(filterButton);

    // Open the sortBy dropdown and select "UpdatedAt"
    const sortByDropdown = screen.getByTestId('select-button-sortBy');
    fireEvent.click(sortByDropdown);

    const sortByOption = screen.getByText('UpdatedAt');
    fireEvent.click(sortByOption);

    // Open the order dropdown and select "Descendant"
    const orderDropdown = screen.getByTestId('select-button-order');
    fireEvent.click(orderDropdown);
    const orderOption = screen.getByText('Descendant');
    fireEvent.click(orderOption);

    // Open the active dropdown and select "Active"
    const activeDropdown = screen.getByTestId('select-button-order');
    fireEvent.click(activeDropdown);
    const activeOption = screen.getByText('Active');
    fireEvent.click(activeOption);

    // Check that the selected values are updated
    expect(sortByDropdown).toHaveTextContent('UpdatedAt');
    expect(orderDropdown).toHaveTextContent('Descendant');
  });

  test("should call filterData with different parameters based on filter fields values when 'Filtrer' button is clicked", async () => {
    render(<AdminFilter />);
    const filterButton = screen.getByTitle('Filter data');
    fireEvent.click(filterButton);

    const originalFilterData = useNewsLetterStore.getState().filterData;
    const originalSetFilterRequest =
      useNewsLetterStore.getState().setFilterRequest;

    const mockFilterData = jest.fn();
    const mockSetFilterRequest = jest.fn();

    act(() => {
      useNewsLetterStore.setState({
        filterData: mockFilterData,
        setFilterRequest: mockSetFilterRequest,
      });
    });

    // Open the sortBy dropdown and select "UpdatedAt"
    const sortByDropdown = screen.getByTestId('select-button-sortBy');
    fireEvent.click(sortByDropdown);
    const sortByOption = screen.getByText('UpdatedAt');
    fireEvent.click(sortByOption);

    // Open the order dropdown and select "Descendant"
    const orderDropdown = screen.getByTestId('select-button-order');
    fireEvent.click(orderDropdown);
    const orderOption = screen.getByText('Descendant');
    fireEvent.click(orderOption);

    // Open the active dropdown and select "Active"
    const activeDropdown = screen.getByTestId('select-button-active');
    fireEvent.click(activeDropdown);
    const activeOption = screen.getByText('Active');
    fireEvent.click(activeOption);

    const filtrerButton = screen.getByText('Filter');
    fireEvent.click(filtrerButton);

    await waitFor(() => {
      expect(mockFilterData).toHaveBeenCalledTimes(1);
      expect(mockSetFilterRequest).toHaveBeenCalledWith(
        '?sortBy=updatedAt&order=desc&active=true'
      );
    });

    // Reset to original functions after the test
    act(() => {
      useNewsLetterStore.setState({
        filterData: originalFilterData,
        setFilterRequest: originalSetFilterRequest,
      });
    });
  });

  test("Should reset filter fields to default values when 'Reset' button is clicked", async () => {
    render(<AdminFilter />);
    const filterButton = screen.getByTitle('Filter data');
    fireEvent.click(filterButton);

    const originalSetFilterRequest =
      useNewsLetterStore.getState().setFilterRequest;
    const originalRegistered = useNewsLetterStore.getState().registered;

    const mockSetFilterRequest = jest.fn();
    const mockRegistered = jest.fn();

    act(() => {
      useNewsLetterStore.setState({
        setFilterRequest: mockSetFilterRequest,
        registered: mockRegistered,
      });
    });

    const resetButton = screen.getByTitle('Reset');
    fireEvent.click(resetButton);

    // Check if the selected values are reset
    const sortByDropdown = screen.getByTestId('select-button-sortBy');
    const orderDropdown = screen.getByTestId('select-button-order');
    const activeDropdown = screen.getByTestId('select-button-active');

    expect(sortByDropdown).toHaveTextContent('createAt');
    expect(orderDropdown).toHaveTextContent('asc');
    expect(activeDropdown).toHaveTextContent('none');

    expect(mockSetFilterRequest).toHaveBeenCalled();
    expect(mockRegistered).toHaveBeenCalledTimes(1);

    // Reset to original functions after the test
    act(() => {
      useNewsLetterStore.setState({
        setFilterRequest: originalSetFilterRequest,
        registered: originalRegistered,
      });
    });
  });
});
