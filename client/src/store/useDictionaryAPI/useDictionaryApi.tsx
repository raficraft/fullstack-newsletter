import { create, useStore } from 'zustand';
import DictionaryApiResult from '@api/types';

type DictionaryError = {
  message: string;
};

export type UseDictionarySearchResult = {
  loading: boolean;
  result: DictionaryApiResult | undefined;
  error: DictionaryError | undefined;
  word: string;
  fetchData: (word: string) => Promise<void>;
};

const useApiStore = create<UseDictionarySearchResult>((set) => ({
  loading: false,
  result: undefined,
  error: undefined,
  word: '',
  fetchData: async (word) => {
    set((state) => ({
      ...state,
      loading: true,
    }));

    if (word.trim() === '') {
      set((state) => ({
        ...state,
        result: undefined,
        loading: false,
      }));
      return;
    }

    try {
      const response = await fetch(`/api/dictionary?word=${word}`);
      const data: any = await response.json();
      if (data.error) {
        throw new Error('No Definitions found');
      } else {
        set((state) => ({
          ...state,
          result: data[0],
          error: undefined,
          loading: false,
          word: word,
        }));
      }
    } catch (error: any) {
      set((state) => ({
        ...state,
        error: { message: 'No Definitions found' },
        loading: false,
      }));
    }
  },
}));

export default useApiStore;
