import { renderHook, act, waitFor } from '@testing-library/react';
import useNewsLetterStore, { ApiResponse } from '../useNewsletterStore';
import { Int_Newsletter, mockNewsletters } from '__mocks__/data/data';

const registeredSpy = jest.spyOn(useNewsLetterStore.getState(), 'registered');

const generateFilterUrlSpy = jest.spyOn(
  useNewsLetterStore.getState(),
  'generateFilterUrl'
);
const filterDataSpy = jest.spyOn(useNewsLetterStore.getState(), 'filterData');

describe('Helpers function on store', () => {
  describe('generateFilterUrl', () => {
    test('should return correctly URL with default filter params', () => {
      const { generateFilterUrl, filter } = useNewsLetterStore.getState();
      const url = generateFilterUrl();

      expect(url).toBe('?sortBy=createdAt&order=asc');
      expect(useNewsLetterStore.getState().filterRequest).toBe(
        '?sortBy=createdAt&order=asc'
      );

      expect(filter).toEqual({
        sortBy: 'createdAt',
        orderBy: 'asc',
        active: 'none',
      });
    });

    test('should return correctly URL with other url params', () => {
      useNewsLetterStore.setState({
        filter: {
          sortBy: 'email',
          orderBy: 'desc',
          active: 'true',
        },
      });
      const { generateFilterUrl, filter } = useNewsLetterStore.getState();
      const url = generateFilterUrl();

      expect(url).toBe('?sortBy=email&order=desc&active=true');
      expect(useNewsLetterStore.getState().filterRequest).toBe(
        '?sortBy=email&order=desc&active=true'
      );

      expect(filter).toEqual({
        sortBy: 'email',
        orderBy: 'desc',
        active: 'true',
      });
    });
  });

  describe('resetFilter method', () => {
    beforeEach(() => {
      useNewsLetterStore.setState({
        filter: { sortBy: 'createdAt', orderBy: 'asc', active: 'none' },
        filterRequest: '',
      });
    });

    test('should reset the filter to its default values', async () => {
      const expectedFilter = {
        sortBy: 'createAt',
        orderBy: 'asc',
        active: 'none',
      };
      useNewsLetterStore.setState({
        filter: { sortBy: 'notDefault', orderBy: 'desc', active: 'all' },
      });

      await useNewsLetterStore.getState().resetFilter();

      expect(useNewsLetterStore.getState().filter).toEqual(expectedFilter);
    });

    test('should call generateFilterUrl and filterData', async () => {
      await useNewsLetterStore.getState().resetFilter();

      expect(generateFilterUrlSpy).toHaveBeenCalled();
      expect(filterDataSpy).toHaveBeenCalled();
    });

    test('should call registered', async () => {
      await useNewsLetterStore.getState().resetFilter();

      expect(registeredSpy).toHaveBeenCalled();
    });
  });

  describe('Setters', () => {
    const initialState = {
      data: [],
      errorApi: '',
      loading: false,
      filterRequest: '',
      currentActiveElement: null,
      currentAction: null,
      filter: {
        sortBy: 'createdAt',
        orderBy: 'asc',
        active: 'none',
      },
    };

    afterEach(() => {
      useNewsLetterStore.setState(initialState);
    });

    test('setData should update data correctly', () => {
      const sampleData = [{ id: '1', email: 'test@email.com', active: true }];
      useNewsLetterStore.getState().setData(sampleData);

      expect(useNewsLetterStore.getState().data).toEqual(sampleData);
    });

    test('setFilterRequest should update filterRequest correctly', () => {
      const filterRequest = '?sortBy=email&order=desc&active=true';
      useNewsLetterStore.getState().setFilterRequest(filterRequest);

      expect(useNewsLetterStore.getState().filterRequest).toBe(filterRequest);
    });

    test('setCurrentActiveElement should update currentActiveElement correctly', () => {
      const id = '1';
      useNewsLetterStore.getState().setCurrentActiveElement(id);

      expect(useNewsLetterStore.getState().currentActiveElement).toBe(id);
    });

    test('setErrorApi should update errorApi correctly', () => {
      const errorApi = 'An error has occurred, please try again';
      useNewsLetterStore.getState().setErrorApi(errorApi);

      expect(useNewsLetterStore.getState().errorApi).toBe(errorApi);
    });

    test('updateFilter should update filter correctly', () => {
      const key = 'orderBy';
      const value = 'desc';
      useNewsLetterStore.getState().updateFilter(key, value);

      expect(useNewsLetterStore.getState().filter[key]).toBe(value);
    });
  });
});
