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

type Store = {
  data: any[];
  errorApi: string;
  loading: boolean;
  filterRequest: string;
  currentActiveElement: string | null;
  currentAction: string | null;
  handleRequest: (
    url: string,
    options: RequestInit,
    id?: string
  ) => Promise<any>;
  registered: () => Promise<any[]>;
  subscribe: (email: string) => Promise<any>;
  deleteSubscribe: (id: string) => Promise<void>;
  toggleSubscribe: (id: string, active: boolean) => Promise<any>;
  editSubscribe: (id: string, email: string) => Promise<any>;
  filterData: (url: string) => Promise<any[]>;
  searchSubscriber: (query: string) => Promise<any[]>;
  createReqOptions: (method: string, data: any) => any;
  setFilterRequest: (filter: string) => void;
  setData: (data: any[]) => void;
  setErrorApi: (errorApi: string) => void;
};

const useNewsLetterStore = create<Store>((set, get) => ({
  data: [],
  errorApi: '',
  loading: false,
  filterRequest: '',
  currentActiveElement: null,
  currentAction: null,

  setData: (data: any[]) => set({ data }),

  handleRequest: async (
    url: string,
    options: RequestInit,
    activeId?: string
  ) => {
    try {
      set({ loading: true, currentActiveElement: activeId, errorApi: '' });

      // Introduce a minimum delay for the loading spinner.
      const delay = new Promise((resolve) => setTimeout(resolve, 500));
      const dataFetch = fetch(url, options);

      // Use Promise.all to wait for both the data and the delay.
      const [response] = await Promise.all([dataFetch, delay]);

      // Manage Error

      if (!response.ok) {
        let errorMessage = 'An error has occurred, please try again';
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
          // It's a JSON response, parse it
          const errorData = await response.json();
          errorMessage = errorData.error;
        } else {
          // It's not a JSON response, use a generic error message
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
      {
        method: 'GET',
      }
    );
    set({ data: newsLetters });
    return newsLetters;
  },

  subscribe: async (email: string) => {
    set({ currentAction: StoreActions.INSERT });
    const data = await get().handleRequest(
      `${ROUTE}/subscribe`,
      get().createReqOptions('POST', { email })
    );
    set({ data: [data, ...get().data] });
    return data;
  },

  deleteSubscribe: async (id: string) => {
    set({ currentAction: StoreActions.DELETE });
    await get().handleRequest(
      `${ROUTE}/delete/${id}`,
      { method: 'DELETE' },
      id
    );
    set((state) => {
      const newData = state.data.filter((item) => item.id !== id);
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

    return response;
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

    return response;
  },

  filterData: async (url: string) => {
    set({ currentAction: StoreActions.FILTER });
    const result = await get().handleRequest(`${ROUTE}/registered${url}`, {
      method: 'GET',
    });
    set({ data: result });
    return result;
  },

  searchSubscriber: async (query: string) => {
    set({ currentAction: StoreActions.SEARCH });
    const result = await get().handleRequest(`${ROUTE}/search?query=${query}`, {
      method: 'GET',
    });
    set({ data: result });
    return result;
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
