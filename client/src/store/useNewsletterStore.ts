import { create } from 'zustand';

export const ROUTE = `${process.env.NEXT_PUBLIC_API_URL}newsletter`;

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

export type ApiResponse = {
  success: boolean;
  error?: string;
  data?: any;
};

export type Store = {
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
  ) => Promise<ApiResponse>;
  registered: () => Promise<void>;
  subscribe: (email: string) => Promise<ApiResponse>;
  deleteSubscribe: (id: string) => Promise<ApiResponse>;
  toggleSubscribe: (id: string, active: boolean) => Promise<ApiResponse>;
  editSubscribe: (id: string, email: string) => Promise<ApiResponse>;
  filterData: (url: string, setAction?: boolean) => Promise<ApiResponse>;
  searchSubscriber: (query: string) => Promise<ApiResponse>;
  createReqOptions: (method: string, data: any) => RequestInit;
  setFilterRequest: (filter: string) => void;
  setData: (data: any[]) => void;
  setErrorApi: (errorApi: string) => void;
  updateFilter: (key: string, value: string) => void;
  generateFilterUrl: () => string;
  resetFilter: () => Promise<void>;
  setCurrentActiveElement: (id: string) => void;
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

  // setter and helper

  setData: (data: any[]) => set({ data: data }),

  setFilterRequest: (filter: string) => {
    set({ filterRequest: filter });
  },

  setCurrentActiveElement: (id: string) => {
    set({ currentActiveElement: id });
  },

  setErrorApi: (errorApi: string) => {
    set({ errorApi });
  },

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
    set({
      filter: { sortBy: 'createAt', orderBy: 'asc', active: 'none' },
      currentAction: StoreActions.RELOAD,
    });
    const url = get().generateFilterUrl();
    await get().filterData(url, false);
    await get().registered();
  },

  // call api

  handleRequest: async (
    url: string,
    options: RequestInit,
    activeId?: string
  ) => {
    console.log('url', url);
    console.log('options', options);
    try {
      set({ loading: true, currentActiveElement: activeId, errorApi: '' });

      const delay = new Promise((resolve) => setTimeout(resolve, 500));
      const dataFetch = fetch(url, options);

      const [response] = await Promise.all([dataFetch, delay]);

      let data = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        data = await response.json();
      }

      if (!response.ok) {
        let errorMessage = 'An error has occurred, please try again';
        if (data && data.error) {
          errorMessage = data.error;
        } else {
          errorMessage = `HTTP error! status: ${response.status}`;
        }

        return { success: false, error: errorMessage };
      }

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An error has occurred, please try again',
      };
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
    if (newsLetters.success) {
      set({ data: newsLetters.data });
    } else {
      set({ errorApi: newsLetters.error });
    }
  },

  subscribe: async (email: string) => {
    set({ currentAction: StoreActions.INSERT });
    const response = await get().handleRequest(
      `${ROUTE}/subscribe`,
      get().createReqOptions('POST', { email })
    );
    if (response.success) {
      set({ data: [response.data, ...get().data] });
    } else {
      set({ errorApi: response.error });
    }
    return response;
  },

  deleteSubscribe: async (id: string) => {
    set({ currentAction: StoreActions.DELETE });
    const response = await get().handleRequest(
      `${ROUTE}/delete/${id}`,
      { method: 'DELETE' },
      id
    );
    if (response.success) {
      set((state) => {
        const newData = state.data.filter((item: any) => item.id !== id);
        return { data: newData };
      });
    } else {
      set({ errorApi: response.error });
    }
    return response;
  },

  toggleSubscribe: async (id: string, active: boolean) => {
    set({ currentAction: StoreActions.TOGGLE });
    const response = await get().handleRequest(
      `${ROUTE}/subscribe/toggle/${id}`,
      get().createReqOptions('PUT', { active }),
      id
    );
    if (response.success) {
      set((state) => {
        const newData = [...state.data];
        const index = newData.findIndex((item) => item.id === id);
        if (index !== -1) {
          newData[index] = response.data;
        } else {
          console.warn('ID not found in data:', id);
        }

        return { data: newData };
      });
    } else {
      set({ errorApi: response.error });
    }

    return response;
  },

  editSubscribe: async (id: string, email: string) => {
    set({ currentAction: StoreActions.EDIT });
    const response = await get().handleRequest(
      `${ROUTE}/edit/${id}`,
      get().createReqOptions('PUT', { email }),
      id
    );

    if (response.success) {
      set((state) => {
        const newData = [...state.data];
        const index = newData.findIndex((item) => item.id === id);
        if (index !== -1) {
          newData[index] = response.data;
        }
        return { data: newData };
      });
    } else {
      set({ errorApi: response.error });
    }

    return response;
  },

  searchSubscriber: async (query: string) => {
    set({ currentAction: StoreActions.SEARCH });
    const response = await get().handleRequest(
      `${ROUTE}/search?query=${query}`,
      {
        method: 'GET',
      }
    );

    console.log(response);
    if (response.success) {
      set({ data: response.data });
    } else {
      set({ errorApi: response.error });
    }
    console.log('search', response);
    return response;
  },

  createReqOptions: (method: string, data: any) => {
    return {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  },

  filterData: async (url: string, setAction: boolean = true) => {
    if (setAction) {
      set({ currentAction: StoreActions.FILTER });
    }
    const response = await get().handleRequest(`${ROUTE}/registered${url}`, {
      method: 'GET',
    });

    if (response.success) {
      set({ data: response.data });
    } else {
      set({ errorApi: response.error });
    }

    return response;
  },
}));

export default useNewsLetterStore;
