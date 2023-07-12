import useNewsletterStore, { StoreActions } from '@store/useNewsletterStore';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import AdminFilter from '../AdminFilter';

const state = useNewsletterStore.getState();

const resetFilterSpy = jest.spyOn(state, 'resetFilter');
const updateFilterSpy = jest.spyOn(state, 'updateFilter');
const filterDataSpy = jest.spyOn(state, 'filterData');
const generateFilterUrlSpy = jest.spyOn(state, 'generateFilterUrl');

const regex = {
  filterData: /^Filter data$/,
  filter: /^Filter$/,
  close: /^Close$/,
  reset: /^Reset$/,
};

const useCase = {
  openModal: () => {
    const filterButton = screen.getByTitle(regex.filterData);
    fireEvent.click(filterButton);
  },
  closeModal: () => {
    const closeButton = screen.getByTitle(regex.close);
    fireEvent.click(closeButton);
  },
  reset: () => {
    const resetButton = screen.getByTitle(regex.reset);
    fireEvent.click(resetButton);
  },
  filter: () => {
    const buttonFilter = screen.getByTitle(regex.filter);
    fireEvent.click(buttonFilter);
  },
  selectOption: (testId: string, optionText: string) => {
    fireEvent.click(screen.getByTestId(testId));
    fireEvent.click(screen.getByText(optionText));
  },
};

beforeEach(() => {
  resetFilterSpy.mockClear();
  updateFilterSpy.mockClear();
  filterDataSpy.mockClear();
  generateFilterUrlSpy.mockClear();

  useNewsletterStore.setState({
    loading: false,
    currentAction: null,
    resetFilter: state.resetFilter,
    updateFilter: state.updateFilter,
    filterData: state.filterData,
    generateFilterUrl: state.generateFilterUrl,
  });
});

describe('AdminFilter component', () => {
  describe('Component rendering', () => {
    test('should render properly', () => {
      const { container } = render(<AdminFilter />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('UI interaction', () => {
    test('clicking the reset button displays the spinner', async () => {
      useNewsletterStore.setState({
        loading: true,
        currentAction: StoreActions.RELOAD,
      });

      render(<AdminFilter />);
      useCase.reset();
      await waitFor(() => {
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
      });
    });

    test('clicking the filter button in the modal displays the spinner', async () => {
      useNewsletterStore.setState({
        loading: true,
        currentAction: StoreActions.FILTER,
      });

      render(<AdminFilter />);
      useCase.openModal();
      useCase.filter();

      await waitFor(() => {
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
      });
    });
  });

  describe('Modal interaction', () => {
    test('should open and close filter dialog', async () => {
      render(<AdminFilter />);
      useCase.openModal();
      expect(screen.getByTitle(regex.filter)).toBeInTheDocument();
      useCase.closeModal();
      await waitFor(() => {
        expect(screen.queryByTitle(regex.filter)).not.toBeInTheDocument();
      });
    });

    test('should close the modal after clicking on the Filter button in the modal', async () => {
      render(<AdminFilter />);
      useCase.openModal();
      expect(screen.getByTitle(regex.filter)).toBeInTheDocument();

      useCase.filter();

      await waitFor(() => {
        expect(screen.queryByTitle(regex.filter)).not.toBeInTheDocument();
      });
    });
  });

  describe('Store state testing', () => {
    test('should call resetFilter on reset button click', () => {
      render(<AdminFilter />);
      useCase.reset();
      expect(resetFilterSpy).toBeCalledTimes(1);
    });

    test('should call Filter when click on the dialog box button', () => {
      render(<AdminFilter />);
      useCase.openModal();
      useCase.filter();
      expect(filterDataSpy).toBeCalledTimes(1);
    });

    test('should update filter when select options are chosen', async () => {
      render(<AdminFilter />);

      useCase.openModal();
      useCase.selectOption('select-button-sortBy', 'Email');
      useCase.selectOption('select-button-orderBy', 'Descendant');
      useCase.selectOption('select-button-active', 'Disabled');

      const { filter } = useNewsletterStore.getState();

      await waitFor(() => {
        expect(filter).toEqual({
          sortBy: 'email',
          orderBy: 'desc',
          active: 'false',
        });

        expect(updateFilterSpy).toBeCalledTimes(3);
      });
    });

    test('should call filterData with correct URL on Filter button click', () => {
      render(<AdminFilter />);
      useCase.openModal();

      useCase.filter();

      act(() => {
        const correctUrl = useNewsletterStore.getState().generateFilterUrl();
        expect(filterDataSpy).toBeCalledWith(correctUrl);
      });

      expect(filterDataSpy).toBeCalledTimes(1);
    });

    test('should generate correct URL when filter options are changed', () => {
      render(<AdminFilter />);
      useCase.openModal();

      const { generateFilterUrl } = useNewsletterStore.getState();

      useCase.selectOption('select-button-sortBy', 'Email');
      useCase.selectOption('select-button-orderBy', 'Descendant');
      useCase.selectOption('select-button-active', 'Disabled');
      useCase.filter();

      act(() => {
        const correctUrl = generateFilterUrl();
        expect(correctUrl).toBe('?sortBy=email&order=desc&active=false');
        expect(filterDataSpy).toBeCalledWith(correctUrl);
      });

      expect(filterDataSpy).toBeCalledTimes(1);
    });
  });
});
