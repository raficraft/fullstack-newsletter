import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import AdminFilter from '../AdminFilter';
import { StoreActions } from '@store/useNewsletterStore';
import useNewsletterStore from '@store/useNewsletterStore';
import fetchMock from 'fetch-mock';

beforeEach(() => {
  useNewsletterStore.setState({
    loading: false,
    currentAction: null,
    updateFilter: jest.fn(),
    filterData: jest.fn(),
    // generateFilterUrl: jest.fn(),
    resetFilter: jest.fn(),
  });
});

describe('AdminFilter component', () => {
  test('should render properly', () => {
    const { container } = render(<AdminFilter />);
    expect(container).toBeInTheDocument();
  });

  test('should open and close filter dialog', async () => {
    render(<AdminFilter />);
    const filterButton = screen.getByTitle(/^Filter data$/);
    fireEvent.click(filterButton);

    expect(screen.getByTitle(/^Filter$/)).toBeInTheDocument();

    const closeButton = screen.getByTitle(/^Close$/);
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTitle(/^Filter$/)).not.toBeInTheDocument();
    });
  });

  test('should call resetFilter on reset button click', () => {
    render(<AdminFilter />);
    const resetButton = screen.getByTitle(/Reset/);
    fireEvent.click(resetButton);

    const { resetFilter } = useNewsletterStore.getState();
    expect(resetFilter).toBeCalledTimes(1);
  });

  test('should call Filter when click on the dialog box button', () => {
    render(<AdminFilter />);
    const filterButton = screen.getByTitle(/^Filter data$/);
    fireEvent.click(filterButton);

    const buttonFilter = screen.getByTitle(/^Filter$/);
    fireEvent.click(buttonFilter);

    const { filterData } = useNewsletterStore.getState();
    expect(filterData).toBeCalledTimes(1);
  });

  test('should call Filter when click on the dialog box button', () => {
    render(<AdminFilter />);
    const filterButton = screen.getByTitle(/^Filter data$/);
    fireEvent.click(filterButton);

    // Select Sort By options
    // OpenList
    fireEvent.click(screen.getByTestId('select-button-sortBy'));
    fireEvent.click(screen.getByText('Email'));

    const { updateFilter } = useNewsletterStore.getState();
    expect(updateFilter).toBeCalledTimes(1);

    fireEvent.click(screen.getByTestId('select-button-orderBy'));
    fireEvent.click(screen.getByText('Descendant'));

    expect(updateFilter).toBeCalledTimes(2);

    fireEvent.click(screen.getByTestId('select-button-active'));
    fireEvent.click(screen.getByText('Disabled'));

    expect(updateFilter).toBeCalledTimes(3);
  });

  test('click button filter display spinner', async () => {
    useNewsletterStore.setState({
      loading: true,
      currentAction: StoreActions.RELOAD,
    });

    render(<AdminFilter />);
    const ResetButton = screen.getByTitle(/^Reset$/);
    fireEvent.click(ResetButton);

    await waitFor(() => {
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });

  test('click button filter display spinner', async () => {
    useNewsletterStore.setState({
      loading: true,
      currentAction: StoreActions.FILTER,
    });

    render(<AdminFilter />);

    //open Modal
    const ResetButton = screen.getByTitle(/^Filter data$/);
    fireEvent.click(ResetButton);

    fireEvent.click(screen.getByTitle('Filter'));

    await waitFor(() => {
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });
});
