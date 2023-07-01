import { useState } from 'react';
import useNewsLetterAPI from '@hooks/useNewsLetterAPI/useNewsLetterApi';

const useNewsLetterActions = (initialData: any) => {
  const [data, setData] = useState(initialData || []);
  const {
    errorApi,
    setErrorApi,
    deleteSubscribe,
    toggleSubscribe,
    editSubscribe,
    registered,
    filter,
    searchSubscriber,
  } = useNewsLetterAPI();

  const loadData = async () => {
    const newsLetters = await registered();
    setData(newsLetters);
  };

  const handleDeletesubscribe = async (id: string) => {
    try {
      await deleteSubscribe(id);
      await loadData();
    } catch (error: any) {
      setErrorApi(error.message);
    }
  };

  const handleUnsubscribe = async (id: string, active: boolean) => {
    try {
      await toggleSubscribe(id, active);
      await loadData();
    } catch (error: any) {
      setErrorApi(error.message);
    }
  };

  const handleEditSubscribe = async (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      await editSubscribe(id, event.target.value);
      await loadData();
    } catch (error: any) {
      setErrorApi(error.message);
    }
  };

  const handleFilter = async (url: string) => {
    try {
      const result = await filter(url);
      setData(result);
    } catch (error: any) {
      setErrorApi(error.message);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const result = await searchSubscriber(query);
      setData(result);
    } catch (error: any) {
      setErrorApi(error.message);
    }
  };

  return {
    data,
    errorApi,
    handleDeletesubscribe,
    handleUnsubscribe,
    handleEditSubscribe,
    handleFilter,
    handleSearch,
    loadData,
  };
};

export default useNewsLetterActions;
