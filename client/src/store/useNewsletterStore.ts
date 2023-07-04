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
  data: any[] | any;
  errorApi: string;
  loading: boolean;
  filterRequest: string;
  currentActiveElement: string | null;
  currentAction: string | null;
  handleRequest: (url: string, options: RequestInit, id?: string) => void;
  registered: () => void;
  subscribe: (email: string) => void;
  deleteSubscribe: (id: string) => void;
  toggleSubscribe: (id: string, active: boolean) => void;
  editSubscribe: (id: string, email: string) => void;
  filterData: (url: string) => void;
  searchSubscriber: (query: string) => void;
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

  filterData: async (url: string) => {
    set({ currentAction: StoreActions.FILTER });
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
