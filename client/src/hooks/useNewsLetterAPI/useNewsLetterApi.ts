import { useState } from 'react';

const useNewsLetterAPI = () => {
  const [errorApi, setErrorApi] = useState<string>('');
  const [resultApi, setResultApi] = useState({});
  const [loading, setLoading] = useState<boolean>(false);

  const route = `${process.env.NEXT_PUBLIC_API_URL}/newsletter`;

  const handleRequest = async (url: string, options: RequestInit) => {
    setLoading(true);
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        const data = await response.json();
        setResultApi(data);
        setErrorApi('');
        setLoading(false);
        return data;
      } else {
        const errorData = await response.json();
        setErrorApi(errorData.error);
        setLoading(false);
        throw new Error(errorData.error);
      }
    } catch (error: any) {
      setErrorApi(error.message);
      setLoading(false);
      throw error;
    }
  };

  const registered = () =>
    handleRequest(`${route}/registered`, {
      method: 'GET',
    });

  const subscribe = (email: string) =>
    handleRequest(`${route}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

  const deleteSubscribe = (id: string) =>
    handleRequest(`${route}/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

  const toggleSubscribe = (id: string, active: boolean) =>
    handleRequest(`${route}/subscribe/toggle/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: active }),
    });

  const editSubscribe = (id: string, newEmail: string) =>
    handleRequest(`${route}/edit/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail }),
    });

  return {
    errorApi,
    resultApi,
    loading,
    setLoading,
    registered,
    subscribe,
    deleteSubscribe,
    toggleSubscribe,
    editSubscribe,
  };
};

export default useNewsLetterAPI;
