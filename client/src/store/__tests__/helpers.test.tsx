import useNewsletterStore from '../useNewsletterStore';

const registeredSpy = jest.spyOn(useNewsletterStore.getState(), 'registered');

const generateFilterUrlSpy = jest.spyOn(
  useNewsletterStore.getState(),
  'generateFilterUrl'
);
const filterDataSpy = jest.spyOn(useNewsletterStore.getState(), 'filterData');

describe('Helpers function on store', () => {
  describe('generateFilterUrl', () => {
    test('should return correctly URL with default filter params', () => {
      const { generateFilterUrl, filter } = useNewsletterStore.getState();
      const url = generateFilterUrl();

      expect(url).toBe('?sortBy=createdAt&order=asc');
      expect(useNewsletterStore.getState().filterRequest).toBe(
        '?sortBy=createdAt&order=asc'
      );

      expect(filter).toEqual({
        sortBy: 'createdAt',
        orderBy: 'asc',
        active: 'none',
      });
    });

    test('should return correctly URL with other url params', () => {
      useNewsletterStore.setState({
        filter: {
          sortBy: 'email',
          orderBy: 'desc',
          active: 'true',
        },
      });
      const { generateFilterUrl, filter } = useNewsletterStore.getState();
      const url = generateFilterUrl();

      expect(url).toBe('?sortBy=email&order=desc&active=true');
      expect(useNewsletterStore.getState().filterRequest).toBe(
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
      useNewsletterStore.setState({
        filter: { sortBy: 'createdAt', orderBy: 'asc', active: 'none' },
        filterRequest: '',
      });
    });

    test('should reset the filter to its default values', async () => {
      const expectedFilter = {
        sortBy: 'createdAt',
        orderBy: 'asc',
        active: 'none',
      };
      useNewsletterStore.setState({
        filter: { sortBy: 'notDefault', orderBy: 'desc', active: 'all' },
      });

      await useNewsletterStore.getState().resetFilter();

      expect(useNewsletterStore.getState().filter).toEqual(expectedFilter);
    });

    test('should call generateFilterUrl and filterData', async () => {
      await useNewsletterStore.getState().resetFilter();

      expect(generateFilterUrlSpy).toHaveBeenCalled();
      expect(filterDataSpy).toHaveBeenCalled();
    });

    test('should call registered', async () => {
      await useNewsletterStore.getState().resetFilter();

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
      useNewsletterStore.setState(initialState);
    });

    test('setData should update data correctly', () => {
      const sampleData = [{ id: '1', email: 'test@email.com', active: true }];
      useNewsletterStore.getState().setData(sampleData);

      expect(useNewsletterStore.getState().data).toEqual(sampleData);
    });

    test('setFilterRequest should update filterRequest correctly', () => {
      const filterRequest = '?sortBy=email&order=desc&active=true';
      useNewsletterStore.getState().setFilterRequest(filterRequest);

      expect(useNewsletterStore.getState().filterRequest).toBe(filterRequest);
    });

    test('setCurrentActiveElement should update currentActiveElement correctly', () => {
      const id = '1';
      useNewsletterStore.getState().setCurrentActiveElement(id);

      expect(useNewsletterStore.getState().currentActiveElement).toBe(id);
    });

    test('setErrorApi should update errorApi correctly', () => {
      const errorApi = 'An error has occurred, please try again';
      useNewsletterStore.getState().setErrorApi(errorApi);

      expect(useNewsletterStore.getState().errorApi).toBe(errorApi);
    });

    test('updateFilter should update filter correctly', () => {
      const key = 'orderBy';
      const value = 'desc';
      useNewsletterStore.getState().updateFilter(key, value);

      expect(useNewsletterStore.getState().filter[key]).toBe(value);
    });
  });
});
