import { create } from 'zustand';

const ROUTE = `${process.env.NEXT_PUBLIC_API_URL}newsletter`;

export enum StoreActions {
  RELOAD = 'RELOAD',
  INSERT = 'INSERT',
  DELETE = 'DELETE',
  TOGGLE = 'TOGGLE',
  EDIT = 'EDIT',
  FILTER = 'FILTER',
  SEARCH = 'SEARCH',
}

type Filter = {
  sortBy: string;
  orderBy: string;
  active: string;
};

type Store = {
  data: any[] | any;
  errorApi: string;
  loading: boolean;
  filterRequest: string;
  currentActiveElement: string | null;
  currentAction: StoreActions | null;
  filter: Filter;
  handleRequest: (
    url: string,
    options: RequestInit,
    id?: string
  ) => Promise<any>;
  registered: () => Promise<void>;
  subscribe: (email: string) => Promise<void>;
  deleteSubscribe: (id: string) => Promise<void>;
  toggleSubscribe: (id: string, active: boolean) => Promise<void>;
  editSubscribe: (id: string, email: string) => Promise<void>;
  filterData: (url: string, setAction?: boolean) => Promise<void>;
  searchSubscriber: (query: string) => Promise<void>;
  createReqOptions: (method: string, data: any) => RequestInit;
  setFilterRequest: (filter: string) => void;
  setData: (data: any[]) => void;
  setErrorApi: (errorApi: string) => void;
  updateFilter: (key: string, value: string) => void;
  generateFilterUrl: () => string;
  resetFilter: () => Promise<void>;
};

const useNewsLetterStore = create<Store>((set, get) => ({
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

  setData: (data: any[]) => set({ data }),

  updateFilter: (key: string, value: string) =>
    set((state) => ({
      ...state,
      filter: {
        ...state.filter,
        [key]: value,
      },
    })),

  generateFilterUrl: () => {
    const params = [];
    const { sortBy, orderBy, active } = get().filter;

    params.push(`sortBy=${sortBy}`);
    params.push(`order=${orderBy}`);

    if (active !== 'none') {
      params.push(`active=${active}`);
    }

    const requestOptions = params.length > 0 ? `?${params.join('&')}` : '';
    set({ filterRequest: requestOptions });

    return requestOptions;
  },

  resetFilter: async () => {
    set({ filter: { sortBy: 'createAt', orderBy: 'asc', active: 'none' } });
    const url = get().generateFilterUrl();
    await get().filterData(url, false);
    await get().registered();
  },

  handleRequest: async (
    url: string,
    options: RequestInit,
    activeId?: string
  ) => {
    try {
      console.log(url);
      set({ loading: true, currentActiveElement: activeId, errorApi: '' });

      const delay = new Promise((resolve) => setTimeout(resolve, 500));
      const dataFetch = fetch(url, options);

      const [response] = await Promise.all([dataFetch, delay]);

      if (!response.ok) {
        let errorMessage = 'An error has occurred, please try again';
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          const errorData = await response.json();
          errorMessage = errorData.error;
        } else {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      set({
        errorApi: `Action: ${get().currentAction}, Error: ${
          error.message || 'An error has occurred, please try again'
        }`,
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  registered: async () => {
    set({ currentAction: StoreActions.RELOAD });
    const newsLetters = await get().handleRequest(
      `${ROUTE}/registered${get().filterRequest}`,
      { method: 'GET' }
    );
    set({ data: newsLetters });
  },

  subscribe: async (email: string) => {
    set({ currentAction: StoreActions.INSERT });
    const data = await get().handleRequest(
      `${ROUTE}/subscribe`,
      get().createReqOptions('POST', { email })
    );
    set({ data: [data, ...get().data] });
  },

  deleteSubscribe: async (id: string) => {
    set({ currentAction: StoreActions.DELETE });
    await get().handleRequest(
      `${ROUTE}/delete/${id}`,
      { method: 'DELETE' },
      id
    );
    set((state) => {
      const newData = state.data.filter((item: any) => item.id !== id);
      return { data: newData };
    });
  },

  toggleSubscribe: async (id: string, active: boolean) => {
    set({ currentAction: StoreActions.TOGGLE });
    const response = await get().handleRequest(
      `${ROUTE}/subscribe/toggle/${id}`,
      get().createReqOptions('PUT', { active }),
      id
    );

    set((state) => {
      const newData = [...state.data];
      const index = newData.findIndex((item) => item.id === id);
      if (index !== -1) {
        newData[index] = response;
      }
      return { data: newData };
    });
  },

  editSubscribe: async (id: string, email: string) => {
    set({ currentAction: StoreActions.EDIT });
    const response = await get().handleRequest(
      `${ROUTE}/edit/${id}`,
      get().createReqOptions('PUT', { email }),
      id
    );

    set((state) => {
      const newData = [...state.data];
      const index = newData.findIndex((item) => item.id === id);
      if (index !== -1) {
        newData[index] = response;
      }
      return { data: newData };
    });
  },

  filterData: async (url: string, setAction = true) => {
    setAction && set({ currentAction: StoreActions.FILTER });
    const result = await get().handleRequest(`${ROUTE}/registered${url}`, {
      method: 'GET',
    });
    set({ data: result });
  },

  searchSubscriber: async (query: string) => {
    set({ currentAction: StoreActions.SEARCH });
    const result = await get().handleRequest(`${ROUTE}/search?query=${query}`, {
      method: 'GET',
    });
    set({ data: result });
  },

  createReqOptions: (method: string, data: any) => ({
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),

  setFilterRequest: (filter: string) => {
    set({ filterRequest: filter });
  },

  setErrorApi: (errorApi: string) => {
    set({ errorApi });
  },
}));

export default useNewsLetterStore;
